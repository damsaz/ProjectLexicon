#nullable enable
namespace ProjectLexicon.Models.Shared
{
    /// <summary>
    /// Wrapper for return messages from the api, for get warnings, messages etc. 
    /// </summary>
    public class Response
    {
        public bool IsSuccess { get; set; } = true;
        public int ErrCode { get; set; }
        public string ErrText { get; set; } = "";
        public object? Result { get; set; }
        public Response() { }

        public Response(object result)
        {
            Result = result;
        }
        public Response(int errCode, string errText)
        {
            ErrCode = errCode;
            ErrText = errText;
            IsSuccess = false;
        }
    }

}
