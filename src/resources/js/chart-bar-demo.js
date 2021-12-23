var xValues = [
  "Anh Văn 4",
  "Công nghệ phần mềm",
  "Kỹ thuật điện tử",
  "Lập trình phần tán với công nghệ Java",
  "Nhập môn an toàn thông",
  "Những vấn đề về xã hội và nghề nghiệp",
  "Phát triển ứng Java ",
  "Phương pháp tính",
];
var yValues = [7.6, 6.4, 7.5, 7, 7.2, 7, 6.7, 9.3];
var barColors = [
  "red",
  "green",
  "blue",
  "orange",
  "brown",
  "green",
  "blue",
  "orange",
];
new Chart("myBarChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{ backgroundColor: barColors, data: yValues }],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "Điểm trung bình lớp học phần",
    },
    scales: {
      xAxes: [
        {
          time: { unit: "month" },
          gridLines: { display: false },
          ticks: { maxTicksLimit: 15 },
        },
      ],
      yAxes: [
        {
          ticks: { min: 0, max: 10, maxTicksLimit: 10 },
          gridLines: { display: true },
        },
      ],
    },
  },
});
