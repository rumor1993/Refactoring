const playsData = require("../../data/plays.json");
const invoicesData = require("../../data/invoices.json");
const createStatementData = require("./createStatementData.js");

const result = statement(invoicesData[0], playsData);
const resultHtml = htmlStatement(invoicesData[0], playsData);
console.log(result);
console.log("==============");
console.log(resultHtml);

function statement(invoices, plays) {
  return renderPlainText(createStatementData(invoices, plays));

  function renderPlainText(data, plays) {
    let result = `청구 내역 ( 고객명 : ${data.customer}) \n`;

    for (let perf of data.performances) {
      result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} 석) \n`;
    }

    result += `총액 : ${data.totalAmount} \n`;
    result += `적립 포인트 : ${data.totalVolumeCredits} 점 \n`;
    return result;
  }
}

function htmlStatement(invoices, play) {
  return renderHtml(createStatementData(invoices, play));

  function renderHtml(data) {
    let result = `<h1> 청구 내역 (고객명: ${data.customer})</h1> \n`;
    result += `<table>\n`;
    result += `<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>`;

    for (let perf of data.performances) {
      result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
      result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += `</table>\n`;
    result += `<p> 총액: <em> ${usd(data.totalAmount)} </em></p>\n`;
    result += `<p> 적립 포인트: <em> ${data.totalVolumeCredits}</em>점<p>\n`;
    return result;
  }
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
}
