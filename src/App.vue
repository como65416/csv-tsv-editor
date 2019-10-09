<template>
  <div>
    <h2>TSV/CSV Editor</h2>
    Import From:
    <button class="small ui violet basic button" @click="loadFile()">Load CSV/TSV</button>
    <br />
    Export As:
    <button class="small ui violet basic button" @click="exportFile('csv')">CSV</button>
    <button class="small ui violet basic button" @click="exportFile('tsv')">TSV</button>
    <button class="small ui violet basic button" @click="exportFile('xlsx')">XLSX</button>
    <button class="small ui violet basic button" @click="exportAsMarkdown()">Markdown</button>
    <button class="small ui violet basic button" @click="exportAsTexttable()">Text Table</button>
    <br /><br />
    <data-table :data.sync="data"></data-table>
    <text-dialog @close="dialogClosed()" v-show="showDialog">
      <textarea>{{ dialogContent }}</textarea>
    </text-dialog>
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 300px;
}
</style>

<script>
  import DataTable from './components/DataTable.vue';
  import TextDialog from './components/TextDialog.vue';
  import FileUtil from '../libs/file-util.js';
  import XlsxUtil from '../libs/xlsx-util.js';
  import markdownTable from 'markdown-table';
  import {table as textTable} from 'table';
  import 'semantic-ui-button/button.css';
  import * as Papa from 'papaparse';

  export default {
    data() {
      let data = [];
      for (let i = 0; i < 100; i++) {
        data.push(Array(15).join(".").split("."));
      }
      return {
        data: data,
        showDialog: false,
        dialogContent: '',
      };
    },
    methods : {
      loadFile: function () {
        var self = this;
        FileUtil.loadFile()
          .then(function (content) {
            let r = Papa.parse(content);
            self.data = r.data;
          })
          .catch(function (err) {
            console.log(err);
          })
      },
      exportFile: function(type) {
        let content = "";
        let blob = null;
        switch (type) {
          case "tsv":
            for (let row of this.data) {
              content += row.join("\t") + "\n";
            }
            blob = new Blob([content], {type: 'text/plain'});
            FileUtil.saveFile(blob, 'output.tsv');
            break;
          case "csv":
            content = Papa.unparse(this.data);
            blob = new Blob([content], {type: 'text/plain'});
            FileUtil.saveFile(blob, 'output.csv');
            break;
          case "xlsx":
            blob = XlsxUtil.convertToExcelBlob({
              'sheet': this.data
            });
            FileUtil.saveFile(blob, 'output.xlsx');
            break;
        }
      },
      exportAsMarkdown: function () {
        this.dialogContent = markdownTable(this.getMinifyTableDatas(this.data));
        this.showDialog = true;
      },
      exportAsTexttable: function () {
        let tableDatas = this.getMinifyTableDatas(this.data);
        if (tableDatas.length > 0) {
          // workaround: change empty string to ' '
          for (let i in tableDatas) {
            for (let j in tableDatas[i]) {
              if (tableDatas[i][j] == '') {
                tableDatas[i][j] = ' ';
              }
            }
          }
          this.dialogContent = textTable(tableDatas);
          this.showDialog = true;
        }
      },
      getMinifyTableDatas: function () {
        let maxColumnIndex = -1;
        let maxRowIndex = -1;
        for (let colIndex in this.data) {
          let col = this.data[colIndex].map(d => ((d != null) ? d.trim() : ''));
          if (col.join('') != '') {
            maxColumnIndex = colIndex;
          }
          for (let i = maxRowIndex; i < col.length; i++) {
            if (col[i] != null && col[i].trim() != '') {
              maxRowIndex = i;
            }
          }
        }

        let minifyData = [];
        for (let i = 0; i <= maxColumnIndex; i++) {
          minifyData.push(this.data[i].slice(0, maxRowIndex + 1));
        }
        return minifyData;
      },
      dialogClosed: function () {
        this.showDialog = false;
      }
    },
    components: {
      'data-table': DataTable,
      'text-dialog': TextDialog,
    }
  };
</script>
