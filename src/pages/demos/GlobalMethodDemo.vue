<template>
    <!-- 公共函数使用说明demo -->
    <code>
        <table class="table-public table-public-left fz13">
            <thead>
                <tr>
                    <td colspan="4" class="tip-error">使用方法：先引入文件中的函数名称&nbsp;&nbsp;&nbsp;例如：import {getDateTime} from '@/core/utils/GlobalMethods'</td>
                </tr>
                <tr>
                    <th class="width100">chineseZodiac<br></th>
                    <td class="permin30">/**<br>
                        * 年份转生肖<br>
                        * dateVal：日期 <br>
                        * @chineseZodiac {*} <br>
                        * @return {牛}<br>
                        **/<br>
                    </td>
                    <th class="width100">strLenthByByte</th>
                    <td class="permin30">功能：取字符串的字节长度. 即英文算一个，中文算两个字节<br>
                        输入：str    要计算字节长度的字符串<br>
                        输出：字符串的字节长度
                    </td>
                </tr>
                <tr>
                    <th >mathTime</th>
                    <td>
                        计算时间，当前时间-之前时间=00:00  默认分秒，当达到小时时会显示<br>
                        /**<br>
                        * @param {*} oldTime 传入的时间戳 毫秒数<br>
                        * @param {*} isHour 是否显示小时 default：false<br>
                        * @return string {00:00:00}<br>
                        */<br>
                    </td>
                    <th >getDateTime</th>
                    <td>
                        传入指定的时间戳后获取时间返回的字符串格式<br>
                        /**<br>
                        * @param {*} date 日期  默认new Date<br>
                        * @param {*} isDate 是否显示日期文字 默认显示<br>
                        * @param {*} isTime  是否显示时间文字 默认显示<br>
                        * @param {*} separator 日期文字的连接符 默认为 -  2018-01-01<br>
                        * @return {2019-06-09 00:00:00}<br>
                        */<br>
                        例:{{getDateTimeStr()}}<br>
                    </td>
                </tr>
                <tr>
                    <th >getSexByCrtNo</th>
                    <td>
                        /**<br>
                        * 根据证件号获取性别（仅限于身份证）<br>
                        * @param {string} crtNo 证件号<br>
                        *  @return {string} 男 ，女<br>
                        */<br>
                        <el-input v-model="idCardStr" placeholder="请输入证件号" style="width:12rem;"></el-input>
                        <el-button  type="primary" @click="btnID2SexClickHandler">查询</el-button>
                        <p>结果：{{sex}}</p>
                    </td>
                    <th >getBirthByCrtNo</th>
                    <td>
                        /**<br>
                        * 通过身份证证件号获取用户的生日字符串（仅限于身份证）<br>
                        * @param {string} crtNo <br>
                        * @param {boolean} year 是否显示年份 默认true<br>
                        * @param {boolean} month 是否显示月份 默认true <br>
                        * @param {boolean} day  是否显是日 默认true<br>
                        * @param {string} split 分隔符<br>
                        * @return {string} 1988-10-10<br>
                        */<br>
                        <el-input v-model="birthCrtNo" placeholder="请输入证件号" style="width:12rem;"></el-input>
                        <el-button  type="primary" @click="btnID2BirthClickHandler">查询</el-button>
                        <p>结果：{{birthday}}</p>
                    </td>
                </tr>
                <tr>
                    <th>getDateTimeByStamp</th>
                    <td>
                        /**<br>
                        * 根据后台返回的时间戳返回对应的时间字符串<br>
                        * @param {number} timestamp <br>
                        * @param {boolean} isDate <br>
                        * @param {boolean} isTime <br>
                        * @param {string} separator <br>
                        * @return {2019-06-09 00:00:00}<br>
                        */<br>
                    </td>
                </tr>
            </thead>
        </table>
    </code>
</template>
<script>
import {chineseZodiac,getDateTime,getSexByCrtNo,getBirthByCrtNo} from '@/core/utils/GlobalMethods';
export default {
     data(){
        return{
            dateTime:null,
            idCardStr:"110105198810273421",
            sex:"",
            birthCrtNo:"",
            birthday:"",
        }
    },
    methods:{
        getChineseZodiacHandler(){
            let dd = this.dateTime?this.dateTime:new Date();
        },
        getDateTimeStr(){
           return getDateTime(new Date());
        },
        btnID2SexClickHandler(){
            // console.log("this.idCardStr",this.idCardStr)
            this.sex = getSexByCrtNo(this.idCardStr);
        },
        btnID2BirthClickHandler(){
            this.birthday = getBirthByCrtNo(this.birthCrtNo);
        }
    },
}
</script>