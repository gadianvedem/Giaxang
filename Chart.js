document.addEventListener("DOMContentLoaded", function () {
    // Gửi yêu cầu GET đến API để nhận dữ liệu JSON
    fetch('api.aspx')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu');
            }
            return response.json();
        })
        .then(data => {
            // Hiển thị thông tin lần cập nhật mới nhất
            const updatedTime = new Date(data.latestUpdate.UpdatedTime);
            const formattedTime = updatedTime.toLocaleString('vi-VN');
            document.getElementById('latestUpdate').innerHTML = `
                <p>Lần cập nhật mới nhất: ${data.latestUpdate.TargetCurrency} vào lúc ${formattedTime}</p>
            `;

            // Chuẩn bị dữ liệu cho biểu đồ
            const forexData = data.forexData.map(item => ({
                x: new Date(item.UpdatedTime),
                y: parseInt(item.TargetCurrency)
            }));

            // Vẽ biểu đồ sử dụng Chart.js
            const ctx = document.getElementById('MyChart').getContext('2d');
            const forexChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Giá tiền',
                        data: forexData,
                        borderColor: 'blue',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Giá tiền'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
});
