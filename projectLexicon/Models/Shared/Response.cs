#nullable enable
namespace ProjectLexicon.Models.Shared
{
    /// <summary>
    /// Wrapper for return messages from the api, for get warnings, messages etc. 
    /// </summary>
    public class Response<T>
    {
        public bool IsSuccess { get; set; } = true;
        public int ErrCode { get; set; }
        public string ErrText { get; set; } = "";
        public T? Result { get; set; }
        public Response() { }

        public Response(T result)
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
