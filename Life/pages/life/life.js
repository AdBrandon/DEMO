// pages/life/life.js
Page({
  data: {
    checkbox: [],
    
  },
  
  insert: function () {
    var cb = this.data.checkbox;
    cb.push(this.data.checkbox.length);
    this.setData({
      checkbox: cb
    });
  },
  navigate: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var month;
    try {
      month = wx.getStorageSync('month')
      if (!month) {
        month = 30;
      }
    } catch (e) {
    }




    var list = [];
    for (var i = 0; i < 900; i++){
      if (i < month){
        var color = '#00ae9d'
      } else if(i = month){
        var color = '#ef4136'
      } else{
        var color = '#d9d6c3'
      }
      // list.push({ index: i , bgColor :color});
    }
    // this.setData({
    //   // list: list,
    // })
    console.log(list)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})