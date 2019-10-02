using Newtonsoft.Json;

namespace SQSConsumer.Models
{
    public class S3Event
    {
        public string EventVersion { get; set; }
        public string EventSource { get; set; }
        public string AwsRegion { get; set; }
        public string EventTime { get; set; }
        public string EventName { get; set; }
        public Identity UserIdentity { get; set; }
        public RequestParameters RequestParameters { get; set; }
        public ResponseElements ResponseElements { get; set; }
        public S3 S3 { get; set; }
    }

    public class Identity
    {
        public string PrincipalId { get; set; }
    }

    public class RequestParameters
    {
        public string SourceIPAddress { get; set; }
    }

    public class ResponseElements
    {
        [JsonProperty("x-amz-request-id")]
        public string AmazonRequestId { get; set; }
        [JsonProperty("x-amz-id-2")]
        public string AmazonRequestId2 { get; set; }
    }

    public class S3
    {
        public string S3SchemaVersion { get; set; }
        public string ConfigurationId { get; set; }
        public Bucket Bucket { get; set; }
        [JsonProperty("object")]
        public BucketObject BucketObject { get; set; }
    }

    public class Bucket
    {
        public string Name { get; set; }
        public Identity OwnerIdentity { get; set; }
        public string ARN { get; set; }
    }

    public class BucketObject
    {
        public string Key { get; set; }
        public int Size { get; set; }
        public string ETag { get; set; }
        public string Sequencer { get; set; }
    }
}