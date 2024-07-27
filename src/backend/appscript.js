function doPost(e){
    try {
      var post_data = JSON.parse(e.postData.contents);
      if(!post_data.request_type){
        handleError(post_data, "NO REQUEST TYPE FOUND");
        return ContentService.createTextOutput(500);
      }
      switch(post_data.request_type){
        case "BOOKING":
          return handleBooking(post_data);
        case "ORDER":
          return handleOrders(post_data);
        default: 
          handleError(post_data, "REQUEST TYPE NOT HANDLED");
          return ContentService.createTextOutput(500);
      }
    }catch(error){
      handleError(post_data, error);
      return ContentService.createTextOutput(500);
    }
  }
  
  function handleBooking(post_data){
    try {
  
      if (!post_data.data_ordine || !post_data.nome || !post_data.cognome || !post_data.numero_persone || !post_data.data || !post_data.ora || (!post_data.cellulare && !post_data.email) || !post_data.stato) {
        return ContentService.createTextOutput(500);
      }
      const booking_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TABLE_BOOKING");
      var record = [post_data.data_ordine, post_data.nome, post_data.cognome, post_data.cellulare, post_data.email, post_data.numero_persone, post_data.no_glutine, post_data.no_lattosio, post_data.data, post_data.ora, post_data.stato];
      booking_sheet.insertRowBefore(2);
      booking_sheet.getRange(2, 1, 1, record.length).setValues([record]);
      var recipient = "cst.grzn@gmail.com"; 
      var subject = "Nuova prenotazione ricevuta";
      var body = "E' stata ricevuta una nuova prenotazione:\n\n" +
                 "Data Ordine: " + post_data.data_ordine + "\n" +
                 "Nome: " + post_data.nome + "\n" +
                 "Cognome: " + post_data.cognome + "\n" +
                 "Cellulare: " + post_data.cellulare + "\n" +
                 "Email: " + post_data.email + "\n" +
                 "Numero Persone: " + post_data.numero_persone + "\n" +
                 "No Glutine: " + (post_data.no_glutine ? "Sì" : "No") + "\n" +
                 "No Lattosio: " + (post_data.no_lattosio ? "Sì" : "No") + "\n" +
                 "Data: " + post_data.data + "\n" +
                 "Ora: " + post_data.ora + "\n" +
                 "Stato: " + post_data.stato;
      var options = {
        name: "BARG Admin", 
        noReply: true
      };
      MailApp.sendEmail(recipient, subject, body, options);
      return ContentService.createTextOutput(200);
    } catch (error) {
      handleError(post_data, error);
      return ContentService.createTextOutput(500);
    }
  }
  
  function handleOrders(post_data) {
    try {
      if (!post_data.data_ordine || !post_data.nome || !post_data.cognome || !post_data.numero_persone || !post_data.descrizione || !post_data.scadenza || (!post_data.cellulare && !post_data.email) || !post_data.stato) {
        return ContentService.createTextOutput(500);
      }
      const order_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TABLE_ORDERS");
      var record = [post_data.data_ordine, post_data.nome, post_data.cognome, post_data.cellulare, post_data.email, post_data.numero_persone, post_data.descrizione, post_data.scadenza, post_data.stato];
      order_sheet.insertRowBefore(2);
      order_sheet.getRange(2, 1, 1, record.length).setValues([record]);
      var recipient = "cst.grzn@gmail.com";
      var subject = "Nuovo ordine ricevuto";
      var body = "E' stata ricevuta una nuova prenotazione:\n\n" +
        "Data Ordine: " + post_data.data_ordine + "\n" +
        "Nome: " + post_data.nome + "\n" +
        "Cognome: " + post_data.cognome + "\n" +
        "Cellulare: " + post_data.cellulare + "\n" +
        "Email: " + post_data.email + "\n" +
        "Numero Persone: " + post_data.numero_persone + "\n" +
        "Descrizione: " + post_data.descrizione + "\n" +
        "Consegna Desiderata: " + post_data.scadenza+
        "Stato: " + post_data.stato;
      var options = {
        name: "BARG Admin",
        noReply: true
      };
      MailApp.sendEmail(recipient, subject, body, options);
      return ContentService.createTextOutput(200);
    } catch (error) {
      handleError(post_data, error);
      return ContentService.createTextOutput(500);
    }
  }
  
  function handleError(post_data, error){
      const error_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EXEC_ERRORS");
      var record = [new Date().toISOString(), JSON.stringify(post_data), error.toString(), "YES"];
      error_sheet.insertRowBefore(2);
      error_sheet.getRange(2, 1, 1, record.length).setValues([record]);
      var recipient = "cst.grzn@gmail.com"; 
      var subject = "Nuovo errore di esecuzione BARGAdmin";
      var body = "Una transazione è andata in errore e richiede il tuo intervento:\n\n" +
                 "Data: " + new Date().toISOString() + "\n" + "\n" +
                 "Dati: " + JSON.stringify(post_data) + "\n" +
                 "Errore: " + error.toString();
      var options = {
        name: "BARG Admin", 
        noReply: true
      };
      MailApp.sendEmail(recipient, subject, body, options);
      return ContentService.createTextOutput(200);
  }
  