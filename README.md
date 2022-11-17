# workerd_stream

## Summary

Example of using nginx in front of a pool of workerd processes and streaming a response with Web Streams API.

## Prerequisites

### nginx

Install with a package manager like Homebrew on Mac

```sh
brew install nginx
```

### volta

```sh
curl https://get.volta.sh | bash
```

## Running

Run in a shell

```sh
./start.sh
```

Then open http://localhost:8080/
