# API Gateway
resource "aws_apigatewayv2_api" "api" {
  name          = "power-chart-api"
  protocol_type = "HTTP"
}

# API Stage
resource "aws_apigatewayv2_stage" "prod" {
  api_id = aws_apigatewayv2_api.api.id
  name   = var.api_stage_name
  auto_deploy = true
}

# Chart Lambda Integration
resource "aws_apigatewayv2_integration" "chart_integration" {
  api_id = aws_apigatewayv2_api.api.id

  integration_uri    = aws_lambda_function.chart_function.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

# API Route
resource "aws_apigatewayv2_route" "chart_route" {
  api_id = aws_apigatewayv2_api.api.id
  route_key = "POST /api/chart"
  target    = "integrations/${aws_apigatewayv2_integration.chart_integration.id}"
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "chart_api_gw" {
  statement_id  = "AllowExecutionFromAPIGatewayChart"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chart_function.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*/api/chart"
} 