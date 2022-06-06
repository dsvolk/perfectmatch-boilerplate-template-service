FROM 737852819915.dkr.ecr.us-east-1.amazonaws.com/talentfabric/node14-base:0.1.3

COPY . /home/node
RUN aws codeartifact login --tool npm --repository perfectmatch-core --domain talent-fabric --domain-owner 737852819915 \
    && npm install \
    && npm run build

ENV NODE_ENV production
#Start the server
CMD ["npm", "run", "start:prod"]
