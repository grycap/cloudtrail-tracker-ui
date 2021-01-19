module.exports = {
    REFERDATA: {
        PL_EC2: {
            CreateKeyPair: 1,
            CreateSecurityGroup: 1,
            AuthorizeSecurityGroupIngress: 1,
            RunInstances: 2,
            StopInstances: 1,
            StartInstances: 1,
            TerminateInstances: 2
        },
        PL_EC2_S3: {
            AttachVolume: 2,
            CreateAutoScalingGroup: 1,
            CreateBucket: 1,
            CreateImage: 1,
            CreateLaunchTemplate: 1,
            CreateListener: 1,
            CreateLoadBalancer: 1,
            CreateSnapshot: 1,
            CreateTags: 1,
            CreateTargetGroup: 1,
            CreateVolume: 2,
            DeleteAutoScalingGroup: 1,
            DeleteLaunchTemplate: 1,
            DeleteLoadBalancer: 1,
            DeleteBucket: 1,
            DeleteVolume: 2,
            DeleteTargetGroup: 1,
            DeregisterTargets: 1,
            DetachVolume: 1,
            PutBucketWebsite: 1,
            PutMetricAlarm: 2,
            PutScalingPolicy: 1,
            RegisterTargets: 1,
            RunInstances: 4,
            TerminateInstances: 4,
        },
        PL_RDS: {
            ChangeResourceRecordSets: 2,
            CreateDBInstance: 1,
            CreateDBInstanceReadReplica: 1,
            DeleteDBInstance: 2,
            ModifyDBInstance: 2,
            RebootDBInstance: 1
        },
        PL_DYNAMODB :{
            PutMetricAlarm: 2,
            CreateTopic: 1,
            CreateTable: 2,
            DeleteTable: 2,
            DeleteAlarms: 1
        },
        // PL_SDB: {
        //     CreateDomain: 1,
        //     PutAttributes: 2,
        //     DeleteAttributes: 2,
        //     DeleteDomain: 1

        // },
        PL_APP: {
            AddTagsToResource: 1,
            AllocateAddress: 1,
            AssociateAddress: 1,
            AuthorizeSecurityGroupIngress: 1,
            CreateAutoScalingGroup: 1,
            CreateDBInstance: 1,
            CreateImage: 1,
            CreateLaunchConfiguration: 1,
            CreateListener: 1,
            CreateLoadBalancer: 1,
            CreateSecurityGroup: 1,
            CreateTargetGroup: 1,
            DeleteAutoScalingGroup: 1,
            DeleteLaunchConfiguration: 1,
            DeleteLoadBalancer: 1,
            PutMetricAlarm: 2,
            PutScalingPolicy: 2,
            ReleaseAddress: 1,
            RunInstances: 1,
            TerminateInstances: 1,
            UpdateAutoScalingGroup: 1,
            DeleteDBInstance: 1,
            DisassociateAddress: 1,
            DeregisterImage: 1,
            DeleteTargetGroup: 1,
            DeleteSecurityGroup: 1,


        },
        PL_CF : {
            AttachVolume: 2,
            AuthorizeSecurityGroupEgress: 1,
            AuthorizeSecurityGroupIngress: 5,
            CreateAutoScalingGroup: 1,
            CreateChangeSet: 1,
            CreateLaunchConfiguration: 1,
            CreateListener: 1,
            CreateLoadBalancer: 1,
            CreateSecurityGroup: 3,
            CreateStack: 4,
            CreateTags: 14,
            CreateTargetGroup: 1,
            CreateVolume: 2,
            DeleteAlarms: 2,
            DeleteAutoScalingGroup: 1,
            DeleteDBInstance: 2,
            DeleteLaunchConfiguration: 1,
            DeleteListener: 1,
            DeleteLoadBalancer: 1,
            DeletePolicy: 2,
            DeleteSecurityGroup: 7,
            DeleteStack: 4,
            DeleteTargetGroup: 1,
            DeleteVolume: 2,
            DetachVolume: 2,
            EstimateTemplateCost: 3,
            ModifyDBInstance: 2,
            ModifyInstanceAttribute: 2,
            ModifyVolumeAttribute: 2,
            PutMetricAlarm: 2,
            PutScalingPolicy: 2,
            RestoreDBInstanceFromDBSnapshot: 2,
            RevokeSecurityGroupEgress: 2,
            RunInstances: 3,
            TerminateInstances: 3,
            UpdateAutoScalingGroup: 2,
            UpdateStack: 2
        },
        PL_VPC:{
            AllocateAddress: 1,
            AssociateAddress: 1,
            AssociateRouteTable: 1,
            AttachInternetGateway: 1,
            AuthorizeSecurityGroupIngress: 4,
            CreateInternetGateway: 1,
            CreateRouteTable: 1,
            CreateSecurityGroup: 2,
            CreateSubnet: 2,
            CreateTags: 6,
            CreateVpc: 1,
            DeleteInternetGateway: 1,
            DeleteRouteTable: 1,
            DeleteSecurityGroup: 2,
            DeleteSubnet: 2,
            DeleteVpc: 1,
            DetachInternetGateway: 1,
            ModifyInstanceAttribute: 1,
            ModifyVpcAttribute: 2,
            RunInstances: 3,
            TerminateInstances: 1
        },
        PL_EMR : {
            RunJobFlow: 1
        },
        PL_LAMBDA_SQS: {
            AddPermission20150331v2: 1,
            CreateFunction20150331: 1,
            CreateQueue: 1,
            DeleteFunction20150331: 1,
            DeleteLogGroup: 1,
            PutBucketNotification: 1,
            PutRule: 1,
            PutTargets: 1,
            SetQueueAttributes: 1,
            TestEventPattern: 1
        },
        PL_SERVERLESS_APP: {
            ChangeResourceRecordSets:  2,
            CreateAuthorizer: 1,
            CreateBasePathMapping: 1,
            CreateBucket: 1,
            CreateDeployment: 1,
            CreateDistribution: 1,
            CreateDomainName: 1,
            CreateFunction20150331: 1,
            CreateGrant: 1,
            CreateLogGroup: 1,
            CreateResource: 1,
            CreateRestApi: 1,
            CreateStack: 1,
            CreateTable: 1,
            CreateUserPool: 1,
            CreateUserPoolClient: 1,
            CreateUserPoolDomain: 1,
            DeleteBucket: 2,
            DeleteDeployment: 1,
            DeleteDomainName: 1,
            DeleteFunction20150331: 1,
            DeleteLogGroup: 1,
            DeleteMethod: 1,
            DeleteResource: 1,
            DeleteRestApi: 1,
            DeleteStack: 1,
            DeleteTable: 1,
            DeleteUserPool: 1,
            DeleteUserPoolClient: 1,
            DeleteUserPoolDomain: 1,
            PublishVersion20150331: 1,
            PutBucketNotification: 1,
            PutBucketWebsite: 1,
            PutIntegration: 1,
            PutIntegrationResponse: 1,
            PutMethod: 1,
            PutMethodResponse: 1,
            RemovePermission20150331v2: 1,
            TagResource: 1,
            UpdateAuthorizer: 1,
            UpdateDistribution: 1,
            UpdateGatewayResponse: 1,
            UpdateIntegrationResponse: 1,
            UpdateMethod: 1,
            UpdateMethodResponse: 1,
            UpdateStage: 1,
            UpdateUserPoolClient: 1,
            ValidateTemplate: 1,
            DeleteDistribution: 1
        }

    },
    REFERDATA1: {
        PL_EC2: {
            CreateKeyPair: 1,
            CreateSecurityGroup: 1,
            AuthorizeSecurityGroupIngress: 1,
            RunInstances: 2,
            StopInstances: 1,
            StartInstances: 1,
            TerminateInstances: 2
        },
        PL_EC2_S3: {
            AttachVolume: 2,
            CreateAutoScalingGroup: 1,
            CreateBucket: 1,
            CreateImage: 1,
            CreateLaunchTemplate: 1,
            CreateListener: 1,
            CreateLoadBalancer: 1,
            CreateSnapshot: 1,
            CreateTags: 1,
            CreateTargetGroup: 1,
            CreateVolume: 2,
            DeleteAutoScalingGroup: 1,
            DeleteLaunchTemplate: 1,
            DeleteLoadBalancer: 1,
            DeleteBucket: 1,
            DeleteVolume: 2,
            DeleteTargetGroup: 1,
            DeregisterTargets: 1,
            DetachVolume: 1,
            PutBucketWebsite: 1,
            PutMetricAlarm: 2,
            PutScalingPolicy: 1,
            RegisterTargets: 1,
            RunInstances: 4,
            TerminateInstances: 4,
        },
        PL_VPC:{
            AllocateAddress: 1,
            AssociateAddress: 1,
            AssociateRouteTable: 1,
            AttachInternetGateway: 1,
            AuthorizeSecurityGroupIngress: 4,
            CreateInternetGateway: 1,
            CreateRouteTable: 1,
            CreateSecurityGroup: 2,
            CreateSubnet: 2,
            CreateTags: 6,
            CreateVpc: 1,
            DeleteInternetGateway: 1,
            DeleteRouteTable: 1,
            DeleteSecurityGroup: 2,
            DeleteSubnet: 2,
            DeleteVpc: 1,
            DetachInternetGateway: 1,
            ModifyInstanceAttribute: 1,
            ModifyVpcAttribute: 2,
            RunInstances: 3,
            TerminateInstances: 1
        },
        PL_RDS: {
            ChangeResourceRecordSets: 2,
            CreateDBInstance: 1,
            CreateDBInstanceReadReplica: 1,
            DeleteDBInstance: 2,
            ModifyDBInstance: 2,
            RebootDBInstance: 1
        },
        PL_DYNAMODB :{
            PutMetricAlarm: 2,
            CreateTopic: 1,
            CreateTable: 2,
            DeleteTable: 2,
            DeleteAlarms: 1
        },
        // PL_SDB: {
        //     CreateDomain: 1,
        //     PutAttributes: 2,
        //     DeleteAttributes: 2,
        //     DeleteDomain: 1

        // },
        PL_APP: {
            AddTagsToResource: 1,
            AllocateAddress: 1,
            AssociateAddress: 1,
            AuthorizeSecurityGroupIngress: 1,
            CreateAutoScalingGroup: 1,
            CreateDBInstance: 1,
            CreateImage: 1,
            CreateLaunchConfiguration: 1,
            CreateListener: 1,
            CreateLoadBalancer: 1,
            CreateSecurityGroup: 1,
            CreateTargetGroup: 1,
            DeleteAutoScalingGroup: 1,
            DeleteLaunchConfiguration: 1,
            DeleteLoadBalancer: 1,
            PutMetricAlarm: 2,
            PutScalingPolicy: 2,
            ReleaseAddress: 1,
            RunInstances: 1,
            TerminateInstances: 1,
            UpdateAutoScalingGroup: 1,
            DeleteDBInstance: 1,
            DisassociateAddress: 1,
            DeregisterImage: 1,
            DeleteTargetGroup: 1,
            DeleteSecurityGroup: 1,


        },
        PL_CF : {
            AttachVolume: 2,
            AuthorizeSecurityGroupEgress: 1,
            AuthorizeSecurityGroupIngress: 5,
            CreateAutoScalingGroup: 1,
            CreateChangeSet: 1,
            CreateLaunchConfiguration: 1,
            CreateListener: 1,
            CreateLoadBalancer: 1,
            CreateSecurityGroup: 3,
            CreateStack: 4,
            CreateTags: 14,
            CreateTargetGroup: 1,
            CreateVolume: 2,
            DeleteAlarms: 2,
            DeleteAutoScalingGroup: 1,
            DeleteDBInstance: 2,
            DeleteLaunchConfiguration: 1,
            DeleteListener: 1,
            DeleteLoadBalancer: 1,
            DeletePolicy: 2,
            DeleteSecurityGroup: 7,
            DeleteStack: 4,
            DeleteTargetGroup: 1,
            DeleteVolume: 2,
            DetachVolume: 2,
            EstimateTemplateCost: 3,
            ModifyDBInstance: 2,
            ModifyInstanceAttribute: 2,
            ModifyVolumeAttribute: 2,
            PutMetricAlarm: 2,
            PutScalingPolicy: 2,
            RestoreDBInstanceFromDBSnapshot: 2,
            RevokeSecurityGroupEgress: 2,
            RunInstances: 3,
            TerminateInstances: 3,
            UpdateAutoScalingGroup: 2,
            UpdateStack: 2
        },

        PL_EMR : {
            RunJobFlow: 1
        },
        PL_LAMBDA_SQS: {
            AddPermission20150331v2: 1,
            CreateFunction20150331: 1,
            CreateQueue: 1,
            DeleteFunction20150331: 1,
            DeleteLogGroup: 1,
            PutBucketNotification: 1,
            PutRule: 1,
            PutTargets: 1,
            SetQueueAttributes: 1,
            TestEventPattern: 1
        },
        PL_SERVERLESS_APP: {
            ChangeResourceRecordSets:  2,
            CreateAuthorizer: 1,
            CreateBasePathMapping: 1,
            CreateBucket: 1,
            CreateDeployment: 1,
            CreateDistribution: 1,
            CreateDomainName: 1,
            CreateFunction20150331: 1,
            CreateGrant: 1,
            CreateLogGroup: 1,
            CreateResource: 1,
            CreateRestApi: 1,
            CreateStack: 1,
            CreateTable: 1,
            CreateUserPool: 1,
            CreateUserPoolClient: 1,
            CreateUserPoolDomain: 1,
            DeleteBucket: 2,
            DeleteDeployment: 1,
            DeleteDomainName: 1,
            DeleteFunction20150331: 1,
            DeleteLogGroup: 1,
            DeleteMethod: 1,
            DeleteResource: 1,
            DeleteRestApi: 1,
            DeleteStack: 1,
            DeleteTable: 1,
            DeleteUserPool: 1,
            DeleteUserPoolClient: 1,
            DeleteUserPoolDomain: 1,
            PublishVersion20150331: 1,
            PutBucketNotification: 1,
            PutBucketWebsite: 1,
            PutIntegration: 1,
            PutIntegrationResponse: 1,
            PutMethod: 1,
            PutMethodResponse: 1,
            RemovePermission20150331v2: 1,
            TagResource: 1,
            UpdateAuthorizer: 1,
            UpdateDistribution: 1,
            UpdateGatewayResponse: 1,
            UpdateIntegrationResponse: 1,
            UpdateMethod: 1,
            UpdateMethodResponse: 1,
            UpdateStage: 1,
            UpdateUserPoolClient: 1,
            ValidateTemplate: 1,
            DeleteDistribution: 1
        }

    },
    INITDATA: {
        PL_EC2: {
            ConsoleLogin: 0,
            CreateKeyPair: 0,
            CreateSecurityGroup: 0,
            AuthorizeSecurityGroupIngress: 0,
            RunInstances: 0,
            StopInstances: 0,
            StartInstances: 0,
            TerminateInstances: 0
        },
        PL_EC2_S3: {
            AttachVolume: 0,
            CreateAutoScalingGroup: 0,
            CreateBucket: 0,
            CreateImage: 0,
            CreateLaunchTemplate: 0,
            CreateListener: 0,
            CreateLoadBalancer: 0,
            CreateSnapshot: 0,
            CreateTags: 0,
            CreateTargetGroup: 0,
            CreateVolume: 0,
            DeleteAutoScalingGroup: 0,
            DeleteLaunchTemplate: 0,
            DeleteLoadBalancer: 0,
            DeleteBucket: 0,
            DeleteVolume: 0,
            DeleteTargetGroup: 0,
            DeregisterTargets: 0,
            DetachVolume: 0,
            PutBucketWebsite: 0,
            PutMetricAlarm: 0,
            PutScalingPolicy: 0,
            RegisterTargets: 0,
            RunInstances: 0,
            TerminateInstances: 0,
        },
        PL_RDS: {
            ChangeResourceRecordSets: 0,
            CreateDBInstance: 0,
            CreateDBInstanceReadReplica: 0,
            DeleteDBInstance: 0,
            ModifyDBInstance: 0,
            RebootDBInstance: 0
        },
        PL_DYNAMODB :{
            PutMetricAlarm: 0,
            CreateTopic: 0,
            CreateTable: 0,
            DeleteTable: 0,
            DeleteAlarms: 0
        },
        // PL_SDB: {
        //     CreateDomain: 0,
        //     PutAttributes: 0,
        //     DeleteAttributes: 0,
        //     DeleteDomain: 0

        // },
        PL_APP: {
            AddTagsToResource: 0,
            AllocateAddress: 0,
            AssociateAddress: 0,
            AuthorizeSecurityGroupIngress: 0,
            CreateAutoScalingGroup: 0,
            CreateDBInstance: 0,
            CreateImage: 0,
            CreateLaunchConfiguration: 0,
            CreateListener: 0,
            CreateLoadBalancer: 0,
            CreateSecurityGroup: 0,
            CreateTargetGroup: 0,
            DeleteAutoScalingGroup: 0,
            DeleteLaunchConfiguration: 0,
            DeleteLoadBalancer: 0,
            PutMetricAlarm: 0,
            PutScalingPolicy: 0,
            ReleaseAddress: 0,
            RunInstances: 0,
            TerminateInstances: 0,
            UpdateAutoScalingGroup: 0,
            DeleteDBInstance: 0,
            DisassociateAddress: 0,
            DeregisterImage: 0,
            DeleteTargetGroup: 0,
            DeleteSecurityGroup: 0,

        },
        PL_CF : {
            AttachVolume: 0,
            AuthorizeSecurityGroupEgress: 0,
            AuthorizeSecurityGroupIngress: 0,
            CreateAutoScalingGroup: 0,
            CreateChangeSet: 0,
            CreateLaunchConfiguration: 0,
            CreateListener: 0,
            CreateLoadBalancer: 0,
            CreateSecurityGroup: 0,
            CreateStack: 0,
            CreateTags: 0,
            CreateTargetGroup: 0,
            CreateVolume: 0,
            DeleteAlarms: 0,
            DeleteAutoScalingGroup: 0,
            DeleteDBInstance: 0,
            DeleteLaunchConfiguration: 0,
            DeleteListener: 0,
            DeleteLoadBalancer: 0,
            DeletePolicy: 0,
            DeleteSecurityGroup: 0,
            DeleteStack: 0,
            DeleteTargetGroup: 0,
            DeleteVolume: 0,
            DetachVolume: 0,
            EstimateTemplateCost: 0,
            ModifyDBInstance: 0,
            ModifyInstanceAttribute: 0,
            ModifyVolumeAttribute: 0,
            PutMetricAlarm: 0,
            PutScalingPolicy: 0,
            RestoreDBInstanceFromDBSnapshot: 0,
            RevokeSecurityGroupEgress: 0,
            RunInstances: 0,
            TerminateInstances: 0,
            UpdateAutoScalingGroup: 0,
            UpdateStack: 0
        },
        PL_VPC:{
            AllocateAddress: 0,
            AssociateAddress: 0,
            AssociateRouteTable: 0,
            AttachInternetGateway: 0,
            AuthorizeSecurityGroupIngress: 0,
            CreateInternetGateway: 0,
            CreateRouteTable: 0,
            CreateSecurityGroup: 0,
            CreateSubnet: 0,
            CreateTags: 0,
            CreateVpc: 0,
            DeleteInternetGateway: 0,
            DeleteRouteTable: 0,
            DeleteSecurityGroup: 0,
            DeleteSubnet: 0,
            DeleteVpc: 0,
            DetachInternetGateway: 0,
            ModifyInstanceAttribute: 0,
            ModifyVpcAttribute: 0,
            RunInstances: 0,
            TerminateInstances: 0
        },
        PL_EMR : {
            RunJobFlow: 0
        },
        PL_LAMBDA_SQS: {
            AddPermission20150331v2: 0,
            CreateFunction20150331: 0,
            CreateQueue: 0,
            DeleteFunction20150331: 0,
            DeleteLogGroup: 0,
            PutBucketNotification: 0,
            PutRule: 0,
            PutTargets: 0,
            SetQueueAttributes: 0,
            TestEventPattern: 0

        },
        PL_SERVERLESS_APP: {
            ChangeResourceRecordSets:  0,
            CreateAuthorizer: 0,
            CreateBasePathMapping: 0,
            CreateBucket: 0,
            CreateDeployment: 0,
            CreateDistribution: 0,
            CreateDomainName: 0,
            CreateFunction20050330: 0,
            CreateGrant: 0,
            CreateLogGroup: 0,
            CreateResource: 0,
            CreateRestApi: 0,
            CreateStack: 0,
            CreateTable: 0,
            CreateUserPool: 0,
            CreateUserPoolClient: 0,
            CreateUserPoolDomain: 0,
            DeleteBucket: 0,
            DeleteDeployment: 0,
            DeleteDomainName: 0,
            DeleteFunction20150331: 0,
            DeleteLogGroup: 0,
            DeleteMethod: 0,
            DeleteResource: 0,
            DeleteRestApi: 0,
            DeleteStack: 0,
            DeleteTable: 0,
            DeleteUserPool: 0,
            DeleteUserPoolClient: 0,
            DeleteUserPoolDomain: 0,
            PublishVersion20150331: 0,
            PutBucketNotification: 0,
            PutBucketWebsite: 0,
            PutIntegration: 0,
            PutIntegrationResponse: 0,
            PutMethod: 0,
            PutMethodResponse: 0,
            RemovePermission20150331v2: 0,
            TagResource: 0,
            UpdateAuthorizer: 0,
            UpdateDistribution: 0,
            UpdateGatewayResponse: 0,
            UpdateIntegrationResponse: 0,
            UpdateMethod: 0,
            UpdateMethodResponse: 0,
            UpdateStage: 0,
            UpdateUserPoolClient: 0,
            ValidateTemplate: 0,
            DeleteDistribution: 0

        }
    }
}
