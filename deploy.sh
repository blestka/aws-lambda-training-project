sam build
sam package --s3-bucket pet.lambdas --output-template-file output.yaml
sam deploy --template-file output.yaml --stack-name sam-test-1 --capabilities CAPABILITY_IAM
