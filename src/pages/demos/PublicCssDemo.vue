<template >
    <!-- 公共css样式 -->
    <table class="table-public table-public-left">
        <thead>
            <tr>
                <td colspan="4" class="tip-error">
                    公共样式可以直接通过class名称添加显示
                </td>
            </tr>
            <tr>
                <th>公共外边距</th>
                <td><code>.m10{margin:10px;}<br>
                .mt10{margin-top:10px;}<br>
                .mr10{margin-right:10px;}<br>
                .mb10{margin-bottom:10px;}<br>
                .ml10{margin-left:10px;}<br>
                .m20{margin:20px;}<br>
                .mt20{margin-top:20px;}<br>
                .mr20{margin-right:20px;}<br>
                .mb20{margin-bottom:20px;}<br>
                .ml20{margin-left:20px;}<br>
                </code>
                </td>
                <th>公共内边距</th>
                <td><code>
                .p10{padding:10px;}<br>
                .pt10{padding-top:10px;}<br>
                .pr10{padding-right:10px;}<br>
                .pb10{padding-bottom:10px;}<br>
                .pl10{padding-left:10px;}<br>
                .p20{padding:20px;}<br>
                .pt20{padding-top:20px;}<br>
                .pr20{padding-right:20px;}<br>
                .pb20{padding-bottom:20px;}<br>
                .pl20{padding-left:20px;}
                </code>
                </td>
            </tr>
            <tr>
                <th>文本定义区</th>
                <td><code>.fz12{
                    font-size:12px;
                }<br>
                .fz13{
                    font-size:13px;
                }<br>
                .fz14{
                    font-size:14px;
                }<br>
                .fz15{
                    font-size:15px;
                }<br>
                .fz16{
                    font-size:16px;
                }<br>
                .fz18{
                    font-size:18px;
                }<br>

                .bold{
                    font-weight: bold;
                }<br>
                .normal{
                    font-weight: normal;
                }
                </code>
                </td>
                <th>颜色定义区</th>
                <td><code>
                默认主题背景色:.bg-color{background:#303131;}
                </code>
                </td>
            </tr>
            <tr>
                <th>定长文本省略...<br>hover时显示全部</th>
                <td>
                    <code>
                        .text-ellipsis<br>
                        {<br>
                        &nbsp;&nbsp;    text-overflow: ellipsis;<br>
                        &nbsp;&nbsp;    white-space: nowrap;<br>
                        &nbsp;&nbsp;    overflow: hidden;<br>
                        }<br>
                    </code>
                    <div style="width:100px;" class="text-ellipsis">例如：this is a long text </div>
                </td>
            </tr>
        </thead>
    </table>
</template>