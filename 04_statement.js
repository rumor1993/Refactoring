const playsData = require("./data/plays.json");
const invoicesData = require("./data/invoices.json");

const result = statement(invoicesData, playsData);
console.log(result);

function statement(invoices, plays) {
  return renderPlainText(invoices, plays);

  function renderPlainText(invoices, plays) {
    let result = `청구 내역 ( 고객명 : ${invoices.customer}) \n`;

    // 값 누적 로직을 별도 for문으로 분리
    // for 문을 두번이나 돌리는데 좋은건가?

    result += `총액 : ${usd(totalAmount())} \n`;
    result += `적립 포인트 : ${totalVolumeCredits()} 점 \n`;
    return result;

    function amountFor(aPerformance) {
      let result = 0;
      switch (playFor(aPerformance).type) {
        case "tragedy":
          result = 40000;
          if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
          }
          break;
        case "comedy":
          result = 30000;
          if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20);
          }
          break;
        default:
          throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
      }
      return result;
    }

    function playFor(aPerformance) {
      return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
      let result = 0;
      result += Math.max(aPerformance.audience - 30, 0);
      if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
      return result;
    }

    function usd(aNumber) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
    }

    function totalVolumeCredits() {
      let result = 0;
      for (let perf of invoices.performances) {
        result += volumeCreditsFor(perf);
      }
      return result;
    }

    function totalAmount() {
      let result = 0;
      for (let perf of invoices.performances) {
        // 청구 내역을 출력한다
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} 석) \n`;
        result += amountFor(perf);
      }
      return result;
    }
  }
}
