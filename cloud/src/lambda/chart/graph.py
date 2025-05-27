def generate_svg_graph(labels, values):
    """
    Generate an SVG graph from the given labels and values.

    Args:
        labels (list): List of labels for the x-axis
        values (list): List of values for the y-axis

    Returns:
        str: SVG content as a string
    """
    # SVG dimensions
    width = 800
    height = 400
    padding = 40

    # Calculate scaling factors
    x_scale = (width - 2 * padding) / (len(labels) - 1)
    y_scale = (height - 2 * padding) / (max(values) - min(values))

    # Create SVG header
    svg = [
        f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">',
        '<style>.axis { stroke: #000; stroke-width: 1; } .line { fill: none; stroke: #0074d9; stroke-width: 2; } .point { fill: #0074d9; } .label { font-family: Arial, sans-serif; }</style>'
    ]

    # Draw axes
    svg.append(f'<line class="axis" x1="{padding}" y1="{height - padding}" x2="{width - padding}" y2="{height - padding}" />')  # X-axis
    svg.append(f'<line class="axis" x1="{padding}" y1="{padding}" x2="{padding}" y2="{height - padding}" />')  # Y-axis

    # Generate points and lines
    points = []
    for i, value in enumerate(values):
        x = padding + i * x_scale
        y = height - padding - (value - min(values)) * y_scale
        points.append((x, y))
        # Add points
        svg.append(f'<circle class="point" cx="{x}" cy="{y}" r="4" />')

    # Draw line
    path_data = " ".join(f"L{x},{y}" for x, y in points)
    svg.append(f'<path class="line" d="M{points[0][0]},{points[0][1]} {path_data}" />')

    # Add labels
    for i, label in enumerate(labels):
        x = padding + i * x_scale
        svg.append(f'<text class="label" x="{x}" y="{height - padding + 15}" font-size="12" text-anchor="middle">{label}</text>')

    # Add title
    svg.append(f'<text class="label" x="{width/2}" y="{padding/2}" font-size="16" text-anchor="middle">24-Hour Power Usage</text>')

    # Close SVG
    svg.append('</svg>')

    return "\n".join(svg)

if __name__ == "__main__":
    labels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
    values = [2.1, 1.9, 1.8, 1.7, 1.8, 2.0, 2.3, 2.5, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.1, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2]

    svg_output = generate_svg_graph(labels, values)

    print(svg_output)
