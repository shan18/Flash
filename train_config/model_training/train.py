import os
import boto3

s3 = boto3.client('s3')
s3.download_file('loovus', 'startup.py', '/home/ubuntu/startup.py')
s3.download_file('loovus', 'start.sh', '/home/ubuntu/start.sh')

os.system('chmod +x /home/ubuntu/startup.py')
os.system('chmod +x /home/ubuntu/start.sh')

os.system('/home/ubuntu/start.sh')
