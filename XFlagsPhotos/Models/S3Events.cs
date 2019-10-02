using System.Collections.Generic;

namespace SQSConsumer.Models
{
    public class S3Events
    {
        public ICollection<S3Event> Records { get; set; }
    }
}