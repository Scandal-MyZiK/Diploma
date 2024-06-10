import Chart from "chart.js/auto";
import Handsontable from "handsontable";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#calc");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const points = calculation();
    const realPoints = document
      .querySelector("#naturalPoints")
      .value.split(",");
    const differenceData = differenceCalc(points, realPoints);
    const sumData = sumCalculation(differenceData);
    const sumOfSumData = sumCalculation(sumData);

    createChart(points, realPoints);
    createTable([points, realPoints, differenceData, sumData, sumOfSumData]);
    createSum(points, realPoints, differenceData, sumData);
  });

  function calculation() {
    const radius = +document.querySelector("#radius").value;
    const lengsK = +document.querySelector("#lengsK").value;
    const lengsL1 = +document.querySelector("#lengsL1").value;
    const lengsL2 = +document.querySelector("#lengsL2").value;

    const results = [];

    calcItem();

    function calcItem() {
      let result;

      const point = results.length;
      if (point * 10 < lengsL1) {
        result = (((1000 * 400) / (8 * radius)) * (point * 10)) / lengsL1;
      } else if (
        point * 10 === lengsL1 ||
        point * 10 === lengsK - lengsL2 ||
        (point * 10 < lengsK - lengsL2 && point * 10 > lengsL1)
      ) {
        result = (1000 * 400) / (8 * radius);
      } else if (point * 10 < lengsK && point * 10 > lengsK - lengsL2) {
        result =
          (((1000 * 400) / (8 * radius)) * (lengsK - point * 10)) / lengsL2;
      } else {
        result = 0;
      }

      if (
        result === 0 &&
        results.length > 0 &&
        results[results.length - 1] === 0
      ) {
        return;
      }

      results.push(Math.round(result));
      calcItem();
    }

    return results;
  }

  function createChart(points, realPoints) {
    const ctx = document.querySelector("#myChart");
    const arr = points.map((_, index) => {
      return index;
    });
    new Chart(ctx, {
      type: "line",
      data: {
        labels: arr,
        datasets: [
          {
            label: "Расчётные данные",
            data: points,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Реальные данные",
            data: realPoints,
            fill: false,
            borderColor: "grey",
            tension: 0.1,
          },
        ],
      },
    });
  }

  function differenceCalc(points, realPoints) {
    const result = [];

    points.forEach((point, index) => {
      result.push(realPoints[index] - point);
    });

    return result;
  }

  function sumCalculation(data) {
    const result = [];

    data.forEach((item, index) => {
      if (index == 0) {
        result.push(item);
        return;
      }

      result.push(item + result[result.length - 1]);
    });
    return result;
  }

  function createTable(data) {
    const container = document.querySelector("#table");

    function pivot(arr) {
      const pivotedArr = [];

      if (!arr || arr.length === 0 || !arr[0] || arr[0].length === 0) {
        return pivotedArr;
      }

      const rowCount = arr.length;
      const colCount = arr[0].length;

      for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
          if (!pivotedArr[j]) {
            pivotedArr[j] = [];
          }

          pivotedArr[j][i] = arr[i][j];
        }
      }

      return pivotedArr;
    }
    new Handsontable(container, {
      data: pivot(data),
      rowHeaders: true,
      colHeaders: [
        "Натурная",
        "Расчетная",
        "Разность",
        "Сумма разностей",
        "Сумма сумм разностей",
      ],
      width: 510,
      transposeTable: true,
      licenseKey: "non-commercial-and-evaluation",
    });
  }

  function createSum(points, realPoints, differenceData, sumData) {
    const arr = [];
    arr.push(points.reduce((prev, current) => +prev + +current, 0));
    arr.push(realPoints.reduce((prev, current) => +prev + +current, 0));
    arr.push(differenceData.reduce((prev, current) => +prev + +current, 0));
    arr.push(sumData.reduce((prev, current) => +prev + +current, 0));

    const sumEl = document.querySelector("#sum");

    sumEl.innerHTML = `Сумма всех точек: <br>
    Расчетные: ${arr[0]} <br/>
    Натурные: ${arr[1]} <br/>
    Разности: ${arr[2]} <br/>
    Сумма разности: ${arr[3]}`;
  }
});
