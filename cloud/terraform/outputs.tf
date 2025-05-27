output "lambda_function_arn" {
  description = "ARN of the chart Lambda function"
  value       = aws_lambda_function.chart_function.arn
}

output "lambda_function_name" {
  description = "Name of the chart Lambda function"
  value       = aws_lambda_function.chart_function.function_name
}

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "chart_endpoint" {
  description = "Chart API endpoint"
  value       = "${aws_apigatewayv2_api.api.api_endpoint}/${var.api_stage_name}/api/chart"
}

# Write chart endpoint to .env file
resource "local_file" "env_file" {
  filename = "${path.module}/../.env"
  content  = "CHART_LAMBDA_URL=${aws_apigatewayv2_api.api.api_endpoint}/${var.api_stage_name}/api/chart"
} 