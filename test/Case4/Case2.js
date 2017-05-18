/* jshint expr: true */
module.exports = {
  tags: ['Case2'],
  'test main-page' : function (client) {
    client
      .url('localhost:10000/main-page')
      .pause(1000)
      .maximizeWindow()
      .pause(1000)
      .click('button[id=orderButton]')
      .pause(1000)
      .click('button[id=meats]')
      .pause(1000)
      .click('img[id=Plus4]')
      .pause(1000)
      .click('button[id=add2Cart4]')
      .pause(1000)
      .click('button[id=bakedGoods]')
      .pause(1000)
      .click('img[id=Plus13]')
      .pause(1000)
      .click('button[id=add2Cart13]')
      .pause(1000)
      .click('button[id=drinks]')
      .pause(1000)
      .click('img[id=Plus20]')
      .pause(1000)
      .click('button[id=add2Cart20]')
      .pause(1000)
      .click('img[id=cart]')
      .pause(1000)
      .setValue('input[id=cusName]', 'Paul')
      .pause(1000)
      .click('button[id=checkout]')
      .pause(1000)
      .acceptAlert()
      .pause(3000);
    
    client.expect.element('button[id=orderButton]').to.be.present;

    client.end();
  }
};