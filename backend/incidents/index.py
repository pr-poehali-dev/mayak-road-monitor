import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для работы с инцидентами на дороге'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            lat = params.get('lat')
            lng = params.get('lng')
            radius = params.get('radius', '59')
            status = params.get('status', 'active')
            
            if lat and lng:
                cur.execute('''
                    SELECT 
                        i.*,
                        u.username, u.first_name, u.last_name,
                        COUNT(c.id) as confirmations_count,
                        (
                            6371 * acos(
                                cos(radians(%s)) * cos(radians(i.latitude)) *
                                cos(radians(i.longitude) - radians(%s)) +
                                sin(radians(%s)) * sin(radians(i.latitude))
                            )
                        ) AS distance
                    FROM incidents i
                    LEFT JOIN users u ON i.user_id = u.id
                    LEFT JOIN confirmations c ON i.id = c.incident_id
                    WHERE i.status = %s
                    GROUP BY i.id, u.id
                    HAVING distance <= %s
                    ORDER BY i.created_at DESC
                ''', (float(lat), float(lng), float(lat), status, float(radius)))
            else:
                cur.execute('''
                    SELECT 
                        i.*,
                        u.username, u.first_name, u.last_name,
                        COUNT(c.id) as confirmations_count
                    FROM incidents i
                    LEFT JOIN users u ON i.user_id = u.id
                    LEFT JOIN confirmations c ON i.id = c.incident_id
                    WHERE i.status = %s
                    GROUP BY i.id, u.id
                    ORDER BY i.created_at DESC
                    LIMIT 50
                ''', (status,))
            
            incidents = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'incidents': incidents}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            user_id = body.get('user_id')
            incident_type = body.get('type')
            title = body.get('title')
            description = body.get('description')
            latitude = body.get('latitude')
            longitude = body.get('longitude')
            
            if not all([user_id, incident_type, title, description, latitude, longitude]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO incidents (user_id, type, title, description, latitude, longitude, status)
                VALUES (%s, %s, %s, %s, %s, %s, 'pending')
                RETURNING id, type, title, description, latitude, longitude, status, created_at
            ''', (user_id, incident_type, title, description, latitude, longitude))
            
            incident = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'incident': incident}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            incident_id = body.get('id')
            status = body.get('status')
            
            if not incident_id or not status:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id or status'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                UPDATE incidents 
                SET status = %s, updated_at = NOW()
                WHERE id = %s
                RETURNING id, status
            ''', (status, incident_id))
            
            incident = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'incident': incident}, default=str),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
        
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
