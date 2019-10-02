using System;
using System.Threading.Tasks;
using Amazon.SQS;
using Amazon.SQS.Model;
using Newtonsoft.Json;
using SQSConsumer.Models;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using System.Collections.Generic;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;

namespace SQSPlayground
{
    class Program
    {
        private static Amazon.RegionEndpoint REGION = Amazon.RegionEndpoint.USWest2;
        private static Amazon.DynamoDBv2.DocumentModel.Table Table;
        static void Main(string[] args)
        {
            var config = ConfigAsync().Result;
            using (var ddbClient = new AmazonDynamoDBClient(REGION))
            {
                Table = Table.LoadTable(ddbClient, config[1]);
                while (true)
                {
                    MainAsync(config[0]).Wait();
                }
            }
        }

        public static async Task<string[]> ConfigAsync()
        {
            var request = new GetParameterRequest()
            {
                Name = "/dotnet/QueueUrl"
            };

            var tblRequest = new GetParameterRequest()
            {
                Name = "/dotnet/TableName"
            };

            var region = Amazon.RegionEndpoint.USWest2;

            using (var client = new AmazonSimpleSystemsManagementClient(REGION))
            {
                try
                {
                    var response = await client.GetParameterAsync(request);
                    var tblResponse = await client.GetParameterAsync(tblRequest);
                    Console.WriteLine($"Parameter {request.Name} has value: {response.Parameter.Value}");
                    return new string[] { response.Parameter.Value, tblResponse.Parameter.Value };
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"Error occurred: {ex.Message}");
                    throw ex;
                }
            }
        }

        static async Task MainAsync(string url)
        {
            using (var sqsClient = new AmazonSQSClient(REGION))
            {
                Console.WriteLine("Running again...");
                ReceiveMessageRequest receiveMessageRequest = new ReceiveMessageRequest()
                {
                    QueueUrl = url,
                    WaitTimeSeconds = 5,
                    MaxNumberOfMessages = 2
                };

                var receiveMessageResponse = await sqsClient.ReceiveMessageAsync(receiveMessageRequest);

                var tasks = new List<Task>();
                receiveMessageResponse.Messages.ForEach(msg =>
                {
                    tasks.Add(ProcessMessageAsync(msg));
                });
                await Task.WhenAll(tasks);
                Console.WriteLine("All Processed...");
                Console.WriteLine("Ending...");
            }
        }

        static async Task<string> PersistMessageStateAsync(Amazon.SQS.Model.Message msg)
        {
            try
            {
                var tblMsg = await Table.GetItemAsync(msg.MessageId);
                Console.WriteLine(tblMsg == null);
                if (tblMsg == null)
                {
                    var status = "Processing";
                    Console.WriteLine("Setting message status...");
                    var processingMsg = new Document();
                    processingMsg["messageId"] = msg.MessageId;
                    processingMsg["status"] = status;
                    var result = await Table.PutItemAsync(processingMsg);
                    Console.WriteLine($"Set message status for {msg.MessageId}");
                    return status;
                }
                else
                {
                    Console.WriteLine($"Current status for message - {tblMsg["messageId"]}:");
                    Console.WriteLine($"- {tblMsg["status"]}");
                    return tblMsg["status"];
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return e.Message;
            }
        }

        static async Task ProcessMessageAsync(Amazon.SQS.Model.Message msg)
        {
            try
            {
                Console.WriteLine(msg.Body);
                var status = await PersistMessageStateAsync(msg);
                Console.WriteLine($"Current message {msg.MessageId} status - {status}");
                var deSer = JsonConvert.DeserializeObject<S3Events>(msg.Body);
                foreach (var item in deSer.Records)
                {
                    Console.WriteLine(item.EventVersion);
                    Console.WriteLine(item.UserIdentity.PrincipalId);
                    Console.WriteLine(item.ResponseElements.AmazonRequestId);
                    Console.WriteLine(item.S3.S3SchemaVersion);
                    Console.WriteLine(item.S3.BucketObject.Key);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}