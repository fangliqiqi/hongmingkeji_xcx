const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const getTime = date =>{
   var dateStr =  new Date(date.replace(new RegExp('-', 'g'), '/')).getTime();
    return dateStr;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  return function () {
    let _nowTime = + new Date().getTime()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this,arguments)
      _lastTime = _nowTime
    }
  }
}
function countFun(fn,count){
  if (count == null || count == undefined) {
    count = 5
  }
  let timer = null;
  let _lastC = count--;
  var that = this;
  fn.apply(this,[_lastC])
  timer= setInterval(function(){
    _lastC = count--;
    fn.apply(this,[_lastC])
    if(_lastC<=0&&timer){
      clearInterval(timer)
    }
  },1000)
  return timer;
}

function Base64toFile(dataurl, filename) {//将base64转换为文件
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

module.exports = {
  formatTime: formatTime,
  formatDate:formatDate,
  throttle: throttle,
  countFun:countFun,
  Base64toFile:Base64toFile,
  getTime:getTime
}
