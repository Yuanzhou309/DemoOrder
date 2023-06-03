FROM python:3.8.10

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the project dependencies
RUN apt-get update && apt-get install -y libpq-dev && \
     pip install --upgrade pip && \
     pip install -r requirements.txt

# Copy the entire project directory into the container
COPY . .

EXPOSE 5000
# Set the command to run your Python application
CMD ["python", "-m", "flask", "run", "--host", "0.0.0.0", "--port", "5000"] 


