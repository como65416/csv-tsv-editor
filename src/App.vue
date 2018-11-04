<template>
  <div>
    <h2>TSV/CSV Editor</h2>
    <button class="small ui violet basic button" @click="loadFile()">Load CSV/TSV</button>
    <button class="small ui violet basic button" @click="exportFile('csv')">Export As CSV</button>
    <button class="small ui violet basic button" @click="exportFile('tsv')">Export As TSV</button>
    <button class="small ui violet basic button" @click="exportFile('xlsx')">Export As XLSX</button>
    <br /><br />
    <data-table :data.sync="data">
    </data-table>
  </div>
</template>

<script>
  import DataTable from './components/DataTable.vue';
  import FileUtil from '../libs/file-util.js';
  import XlsxUtil from '../libs/xlsx-util.js';
  import 'semantic-ui-button/button.css';
  import * as Papa from 'papaparse';

  export default {
    data() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push(Array(5).join(".").split("."));
      }
      return {
        'data': data
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
      }
    },
    components: {
      'data-table': DataTable
    }
  };
</script>
