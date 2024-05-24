using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.UI;

namespace Forex
{
    public partial class api : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string connectionString = "Data Source=127.0.0.1,1443;Initial Catalog=ForexRates;User Id=sa;Password=123;";

            var forexDataList = new List<ForexData>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "SELECT target_currency, updated_time FROM dbo.ForexRates ORDER BY updated_time DESC";
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    forexDataList.Add(new ForexData
                    {
                        TargetCurrency = reader["target_currency"].ToString(),
                        UpdatedTime = (DateTime)reader["updated_time"]
                    });
                }
            }

            var latestUpdate = new ForexData();
            if (forexDataList.Count > 0)
            {
                latestUpdate = forexDataList[0]; // Lấy lần cập nhật mới nhất từ danh sách
            }

            var responseData = new Dictionary<string, object>
            {
                { "latestUpdate", latestUpdate },
                { "forexData", forexDataList }
            };

            var json = new JavaScriptSerializer().Serialize(responseData);
            Response.ContentType = "application/json";
            Response.Write(json);
            Response.End();
        }
    }

    public class ForexData
    {
        public string TargetCurrency { get; set; }
        public DateTime UpdatedTime { get; set; }
    }
}
