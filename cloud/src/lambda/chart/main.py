import json
import base64
import pickle
from graph import generate_svg_graph

def lambda_handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event['body'])

        if "pickled" in body and body["pickled"]:
            body = base64.b64decode(body["data"])
            body = pickle.loads(body)

        # Extract labels and values from the request
        labels = body.get('labels', [])
        values = body.get('values', [])

        # Validate input
        if not labels or not values or len(labels) != len(values):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'error': 'Invalid input: labels and values must be non-empty lists of equal length'
                })
            }

        # Generate SVG graph
        svg_content = generate_svg_graph(labels, values)

        # Convert SVG to base64
        svg_bytes = svg_content.encode('utf-8')
        svg_base64 = base64.b64encode(svg_bytes).decode('utf-8')

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'image/svg+xml',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': svg_base64,
            'isBase64Encoded': True
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }

# Example local test
if __name__ == "__main__":
    # Test event
    test_event = {
        'body': json.dumps({
            'labels': ["00:00", "06:00", "12:00", "18:00", "23:00"],
            'values': [2.1, 2.5, 3.1, 2.7, 2.2]
        })
    }

    # Test the handler
    result = lambda_handler(test_event, None)
    print("Status Code:", result['statusCode'])
    if result['statusCode'] == 200:
        # Save the SVG to a file for testing
        svg_content = base64.b64decode(result['body']).decode('utf-8')
        with open('test_output.svg', 'w') as f:
            f.write(svg_content)
        print("Test SVG saved to test_output.svg")
    else:
        print("Error:", result['body'])
