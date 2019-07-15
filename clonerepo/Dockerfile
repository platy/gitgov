FROM alpine

RUN apk --update add git less openssh bash && \
    rm -rf /var/lib/apt/lists/* && \
rm /var/cache/apk/*

COPY cloneorupdate.bash /
ENTRYPOINT [ "/bin/bash", "/cloneorupdate.bash" ]
