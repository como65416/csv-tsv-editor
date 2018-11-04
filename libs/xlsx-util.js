import XLSX from 'xlsx';

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

/**
 * 將資料轉存成Excel
 *
 * @param object {
 *     shee_name: [
 *         [
 *             ...
 *         ],
 *         [
 *             ...
 *         ],
 *         ...
 *     ],
 *     ...
 * }
 */
function convertToExcelBlob(excel_datas) {
    let workbook = new Workbook();
    for (let sheet_name in excel_datas) {
        workbook.SheetNames.push(sheet_name);
        workbook.Sheets[sheet_name] =  XLSX.utils.json_to_sheet(excel_datas[sheet_name], {skipHeader:true});
    }
    let wopts = { bookType:'xlsx', bookSST:false, type:'array' };
    let wbout = XLSX.write(workbook, wopts);

    let blob = new Blob([wbout],{type:"application/octet-stream"});
    return blob;
}

module.exports = {
  convertToExcelBlob
};