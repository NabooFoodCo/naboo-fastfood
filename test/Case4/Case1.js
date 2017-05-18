/* jshint expr: true */
module.exports = {
  tags: ['Case1'],
  'test main-page' : function (client) {
    client
      .url('localhost:10000/main-page')
      .pause(1000)
      .maximizeWindow()
      .pause(1000)
      .click('button[id=orderButton]')
      .pause(1000)
      .click('button[id=drinks]')
      .pause(1000)
      .click('img[id=Plus20]')
      .pause(1000)
      .click('button[id=add2Cart20]')
      .pause(1000)
      .click('img[id=cart]')
      .pause(1000)
      .setValue('input[id=cusName]', 'John')
      .pause(1000)
      .click('button[id=checkout]')
      .pause(1000)
      .acceptAlert()
      .pause(3000);
    
    client.expect.element('button[id=orderButton]').to.be.present;

    client.end();
  }
};