# Use the official AWS Lambda Python base image
FROM public.ecr.aws/lambda/python:3.13

# Copy your requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy your application code into the container
COPY main.py ./

# (Optional) If you need to include additional files (e.g., templates or static assets), copy them similarly

# Set the CMD to your Lambda handler (here, main.py exports a handler via Mangum)
CMD ["main.handler"]