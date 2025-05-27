# Create IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "power-chart-role-v2"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role.name
}

# Create Lambda function for chart (Python)
data "archive_file" "chart_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../src/lambda/chart"
  output_path = "${path.module}/files/chart.zip"
}

resource "aws_lambda_function" "chart_function" {
  filename         = data.archive_file.chart_lambda_zip.output_path
  function_name    = "power-chart"
  role            = aws_iam_role.lambda_role.arn
  handler         = var.lambda_handler
  runtime         = var.lambda_runtime
  
  source_code_hash = data.archive_file.chart_lambda_zip.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }
}
