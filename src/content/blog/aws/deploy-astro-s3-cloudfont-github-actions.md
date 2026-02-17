---
title: "AWS: Deploying Astro with S3, CloudFront, and GitHub Actions"
date: "2026-02-17"
description: "A practical guide on deploying Astro static site generator to AWS S3 with CloudFront CDN and automating the process using GitHub Actions. Learn how to set up a scalable and secure deployment pipeline for your Astro projects."
slug: "deploy-astro-s3-cloudfront-github-actions"
published: true
tags: ["AWS","Devops"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000"
---

# AWS: Deploying Astro with S3, CloudFront, and GitHub Actions

## Introduction

In this guide, we'll walk through the process of deploying an Astro static site generator to AWS S3 with CloudFront CDN and automating the deployment using GitHub Actions. We'll cover setting up the necessary AWS resources, configuring CloudFront for caching and distribution, and integrating GitHub Actions to automate the deployment pipeline. By the end, you'll have a scalable and secure deployment solution for your Astro projects.

## Prerequisites

Before you begin, ensure you have the following:
- An AWS account with necessary permissions
- An Astro project ready to deploy
- Basic knowledge of AWS services (S3, CloudFront)
- Familiarity with GitHub Actions

## Setting up AWS resources

### Create an S3 bucket

1. Log in to the AWS Management Console and navigate to the S3 service.
![s3-dashboard.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/s3-dashboard.png)
2. Click on *Create bucket*.
![s3-create-bucket.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/s3-create-bucket.png)
3. Enter a unique bucket name and select the desired AWS region.
4. Configure the bucket settings as needed (e.g., versioning, lifecycle policies).
5. Click *Create bucket*.

### Create a CloudFront distribution

1. Log in to the AWS Management Console and navigate to the CloudFront service.
![cloudfont-dashboard.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/cloudfont-dashboard.png)
2. Step 1: Click on *Create distribution* (choose the Free plan).
![cloudfont-dashboard.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/cloudfont-dashboard.png)
3. Step 2: Fill the ***Distribution name*** and choose ***Single website or app*** as the distribution type.
4. Enter the domain name for your website (e.g., example.com).
![create-bucket-step2.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/create-cloudfront-step2.png)
5. Step 3: ***Specify Origin***, Select Origin Type is ***Amazon S3***.
![create-cloudfont-step3.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/create-cloudfont-step3.png)
6. Select the S3 bucket in the Origin section, another section chooses the default recommended settings,
![create-cloudfront-step3-select-s3.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/create-cloudfront-step3-select-s3.png)
7. Step 4: ***Enable Security***, choose the default settings.
8. Step 5: ***Get TLS certificate*** it will auto create a certificate for you, if not, you can create your own certificate.
![cloudfornt-step5-tls-cert.png](/public/blog/deploy-astro-s3-cloudfront-github-actions/cloudfornt-step5-tls-cert.png)
9. Step 6: ***Review and Create***, review the settings and click *Create distribution*.

### Create Group Users

1. Log in to the AWS Management Console and navigate to the IAM service.
2. Click on *Groups* in the left navigation pane.
3. Click on *Create group* and provide a name for the group.
4. Select the policies that you want to attach to the group, such as *AmazonS3FullAccess* and *AmazonCloudFrontFullAccess*.
- My suggestion to create custom policies only includes the necessary permissions for the group.
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "S3Deploy",
			"Effect": "Allow",
			"Action": [
				"s3:PutObject",
				"s3:DeleteObject",
				"s3:ListBucket"
			],
			"Resource": [
				"arn:aws:s3:::truongdq.com",
				"arn:aws:s3:::truongdq.com/*"
			]
		},
		{
			"Sid": "CloudFrontInvalidate",
			"Effect": "Allow",
			"Action": [
				"cloudfront:CreateInvalidation"
			],
			"Resource": "*"
		}
	]
}
```
5. Click *Create group* to create the group.

### Create User Accounts

1. Log in to the AWS Management Console and navigate to the IAM service.
2. Click on *Users* in the left navigation pane.
3. Click on *Add user* and provide a name for the user.
4. Step 1: Specify user details, enter username
5. Step 2: Set permissions, select ***Add user to group*** and choose the group you created in the previous step.
6. Step 3: Review and create, click *Create user*.


### Create a Role in IAM for GitHub Actions

1. Log in to the AWS Management Console and navigate to the IAM service.
2. Click on *Roles* in the left navigation pane.
3. Click on *Create role* 
4. Step 1: Select a trusted entity, Select ***AWS service*** as the trusted entity type, in Use case select ***S3***.
5. Step 2: Choose a service, Choose ***GitHub Actions*** as the service that will use this role.
6. Click on *Next: Permissions*, do not check permissions. I will create custom policies later.
7. Step 3: Name, review, and create, here will enter the role name, after created, we will attach policies to the role.
8. Go to the Dashboard of "IAM Roles," click detail of the role you created. In the Permissions section, click Create Inline Policy.
- Create for ***CustomCloudfontPolicy***
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "VisualEditor0",
			"Effect": "Allow",
			"Action": "cloudfront:CreateInvalidation",
			"Resource": "arn:aws:cloudfront::904610148329:distribution/E1BZYDGZVDSXAW"
		}
	]
}
```

- Create for ***STSAsumeRole***
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:us-east-1:904610148329:accesspoint/truongdq.com/object/*",
        "arn:aws:s3:us-east-1:904610148329:accesspoint/truongdq.com",
        "arn:aws:s3:::truongdq.com",
        "arn:aws:s3:::truongdq.com/*"
      ]
    }
  ]
}
```

- Create for ***CustomS3Policy***
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "sts:GetSessionToken",
        "sts:TagSession",
        "sts:GetFederationToken",
        "sts:*",
        "sts:TagGetWebIdentityToken",
        "sts:GetAccessKeyInfo",
        "sts:GetCallerIdentity",
        "sts:GetServiceBearerToken"
      ],
      "Resource": "*"
    }
  ]
}
```

### Configure GitHub Actions

1. Create file `.github/workflows/deploy.yml` and paste the following code.

```yaml
name: Deploy Astro to S3

on:
  push:
    branches:
      - main

permissions:
  id-token: write     # 🔥 BẮT BUỘC để dùng OIDC
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Build project
        run: bun run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ROOT_ID }}:role/github-deploy-role
          aws-region: ap-southeast-1   # đổi region của bạn

      - name: Deploy to S3
        run: aws s3 sync ./dist s3://truongdq.com --delete

      - name: Verify AWS identity
        run: aws sts get-caller-identity

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.DISTRIBUTION_ID }} \
            --paths "/*"
```

2. Go to the Settings of your GitHub repository, scroll down to ***Actions secrets and variables***, create the following secrets:
- AWS_ROOT_ID:
- DISTRIBUTION_ID:

3. Commit and push the changes.
4. Go to the Actions tab of your repository, you should see the deployment workflow running successfully.
5. Visit your website to verify the deployment.
6. Congratulations! You've successfully deployed your Astro project to AWS S3 with CloudFront CDN and GitHub Actions.

## Conclusion

By following this guide, you'll learn how to deploy your Astro static site generator to AWS S3 with CloudFront CDN and automate the deployment process using GitHub Actions. This setup ensures a scalable and secure deployment pipeline, enabling you to focus on building and delivering your content without worrying about infrastructure management. Whether you're a developer, content creator, or a small business looking to host your website, this guide provides a robust solution for your deployment needs.

## References
- [Deploying Astro with S3, CloudFront, and GitHub Actions](https://truongdq.com/deploy-astro-s3-cloudfront-github-actions)
- [AWS S3 Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Welcome.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

