.PHONY: build
build:
	docker image build -t quackup/login:1.0.0 .

.PHONY: run
run:
	docker container run --rm -p 7000:7000 --env-file .env \
		-t quackup/login:1.0.0
