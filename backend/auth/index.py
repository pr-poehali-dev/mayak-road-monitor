import json
import os
import hmac
import hashlib
from urllib.parse import parse_qs
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для авторизации через Telegram'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            telegram_data = body.get('telegram_data', {})
            
            telegram_id = telegram_data.get('id')
            username = telegram_data.get('username')
            first_name = telegram_data.get('first_name')
            last_name = telegram_data.get('last_name')
            photo_url = telegram_data.get('photo_url')
            
            if not telegram_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid telegram data'}),
                    'isBase64Encoded': False
                }
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute('''
                INSERT INTO users (telegram_id, username, first_name, last_name, photo_url)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (telegram_id) 
                DO UPDATE SET 
                    username = EXCLUDED.username,
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    photo_url = EXCLUDED.photo_url,
                    updated_at = NOW()
                RETURNING id, telegram_id, username, first_name, last_name, photo_url, is_admin
            ''', (telegram_id, username, first_name, last_name, photo_url))
            
            user = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': {
                        'id': user[0],
                        'telegram_id': user[1],
                        'username': user[2],
                        'first_name': user[3],
                        'last_name': user[4],
                        'photo_url': user[5],
                        'is_admin': user[6]
                    }
                }),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
