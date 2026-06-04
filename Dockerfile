FROM alpine:latest

# Define the PocketBase version
ARG PB_VERSION=0.22.14

# Install dependencies
RUN apk add --no-cache \
    unzip \
    ca-certificates

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Create a data directory (though it won't persist on Render's free tier without a paid disk)
RUN mkdir -p /pb/pb_data

# Expose the default port
EXPOSE 8080

# Start PocketBase
# We use 0.0.0.0 to allow external connections
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]
