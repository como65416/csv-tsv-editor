<template>
  <div id="hot-preview">
    <HotTable :settings="settings" v-show="this.settings.data.length > 0"></HotTable>
  </div>
</template>

<script>
  import HotTable from '@handsontable/vue';
  export default {
    props: ['data', 'width', 'height', 'colHeaders'],
    data () {
      let data = {
        settings: {
          data: this.data,
          colHeaders: true,
          rowHeaders: true,
          height: 475,
          rowHeights: 23,
          colHeaders: [],
          manualColumnResize: true,
          manualRowResize: true,
          contextMenu: true,
          viewportColumnRenderingOffset: 10,
          copyPaste: {
            columnsLimit: 1000,
            rowsLimit: 1000000
          }
        }
      }
      return data;
    },
    watch: {
      data(val) {
        this.settings.data = val;
      }
    },
    components: {
      'HotTable' : HotTable
    }
  }
</script>
<style>
  #hot-preview {
    width: 100%;
    overflow: hidden;
  }
</style>
