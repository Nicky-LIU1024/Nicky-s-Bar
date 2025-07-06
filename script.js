// 商品データ：名前、単価、画像パスを持つオブジェクトの配列
const products = [
    { name: "Tequila Sunshine", price: 300, image:"image/Tequila Sunshine.png" },
    { name: "Gin and Tonic", price: 250, image:"image/Gin and Tonic.png" },
    { name: "Pina colada", price: 280, image:"image/Pina colada.png" },
    { name: "Margaret", price: 270, image:"image/Margaret.png" },
    { name: "Negroni", price: 260, image:"image/Negroni.png" }
];

// 注文履歴を保存するための配列（過去の注文データを保持）
const history = [];

// ページ読み込み時に商品の一覧を表示
window.onload = function() {
    const menu = document.getElementById("menu"); // 商品一覧を表示する要素を取得

    // 各商品に対してHTML要素を作成し、menuに追加
    products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product";// CSSクラス設定

    // 商品画像、商品名、単価、注文個数入力欄を挿入
    div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div>${p.name}</div>
        <div>${p.price}円</div>
        <input type="number" id="qty-${i}" min="0" value="0">
    `;
    menu.appendChild(div); // 表示に追加
    });
};

// 注文ボタンが押されたときの処理
function placeOrder() {
    let hasError = false; // 入力エラーの有無
    let total = 0; // 合計金額
    const order = []; // 表示用の注文内容

    // 各商品の注文個数をチェック・加算
    products.forEach((p, i) => {
    const input = document.getElementById(`qty-${i}`);
    const value = input.value.trim(); // 入力値の空白を除去
    input.classList.remove("error"); // 前回のエラー表示を解除

    const num = parseInt(value, 10); // 数値変換
    if (value === "" || isNaN(num) || num < 0) {
        // 無効な値の場合、エラー表示して終了
        alert("個数の指定が不正です。");
        input.classList.add("error");
        hasError = true;
        return;
    }

    if (num > 0) {
        // 有効な注文なら合計計算と注文リストに追加
      total += p.price * num;
        order.push(`${p.name} × ${num}`);
    }
    });

    if (hasError) return; // エラーがあれば注文処理中断

    if (total === 0) {
    alert("すべての注文個数が0です。"); // 全商品が0の場合もエラー
    return;
    }

    // 確認メッセージ
    if (!confirm("注文しました。よろしいですか？")) return;

    // 合計金額を表示
    alert(`合計金額は${total}円です。`);

    // 注文履歴に今回の注文を追加（quantitiesで個数も保存）
    history.push({ order, total, quantities: getQuantities() });
    updateHistory(); // 注文履歴の表を更新

    // 個数情報を配列で取得する関数
    function getQuantities() {
    const qtyList = [];
    for (let i = 0; i < products.length; i++) {
    const input = document.getElementById(`qty-${i}`);
    qtyList.push(parseInt(input.value.trim()) || 0);
    }
    return qtyList;
}


  // 入力欄をすべて「0」にリセット
    products.forEach((_, i) => {
    document.getElementById(`qty-${i}`).value = 0;
    });
}

// 注文履歴をテーブル形式で表示する処理
function updateHistory() {
    const tbody = document.getElementById("historyBody"); // 表の本体部分を取得
    tbody.innerHTML = "";

    let grandTotal = 0; // 全注文の合計金額

    // 各注文を行単位で表示
    history.forEach((entry, idx) => {
    const row = document.createElement("tr");

    // 回数（1回目、2回目…）
    const turnCell = document.createElement("td");
    turnCell.textContent = `${idx + 1}回目`;
    row.appendChild(turnCell);

    // 商品の個数を順番に表示
    for (let i = 0; i < products.length; i++) {
        const qty = entry.quantities[i] || 0;
        const cell = document.createElement("td");
        cell.textContent = qty;
        row.appendChild(cell);
    }

    // 合計金額
    const totalCell = document.createElement("td");
    totalCell.textContent = `${entry.total}円`;
    row.appendChild(totalCell);

    tbody.appendChild(row);

    grandTotal += entry.total;
    });

  // 表の最後に「総合計」行を追加
    if (history.length > 0) {
    const totalRow = document.createElement("tr");
    const totalLabelCell = document.createElement("td");
    totalLabelCell.style.textAlign = "right";
    totalLabelCell.textContent = "総合計";

    const grandTotalCell = document.createElement("td");
    grandTotalCell.textContent = `${grandTotal}円`;

    totalRow.appendChild(totalLabelCell);
    totalRow.appendChild(grandTotalCell);
    tbody.appendChild(totalRow);
    }
}


// 会計処理
function checkout() {
    if (history.length === 0) {
    alert("注文履歴がありません。");
    return;
    }

    if (!confirm("会計を行いますか？")) return;

    const total = history.reduce((sum, h) => sum + h.total, 0);
    alert(`合計で${total}円でした。`);

    history.length = 0;
    updateHistory();
}
