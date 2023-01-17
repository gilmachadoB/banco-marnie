%%[

    #A função 'RequestParameter' faz a recuperação do valor de uma variável enviada via http. 
    SET @nome = RequestParameter("nome") 
    SET @email = RequestParameter("email")
    SET @rg = RequestParameter("rg")
    SET @cpf = RequestParameter("cpf")  
    SET @aniversario = RequestParameter("aniversario") #A variável armazena o dado que foi recuperado.

 //Criando interação. A função 'UpsertDE' adiciona ou atualiza valores na Extensão de Dados de um email, retornando um valor.
 UpsertDE("bancomarnie",1, 'nome', @nome, 'email', @email, "rg", @rg, "cpf", @cpf, "aniversario", @aniversario)

]%%


%%[

    SET @nome = RequestParameter("nome"),
    SET @email = RequestParameter("email"),
    SET @rg = RequestParameter("rg"),
    SET @cpf = RequestParameter("cpf"),
    SET @aniversario = RequestParameter("aniversario")
  
    SET @results = lookup("bancomarnie","nome", @nome, "email",@email, "rg", @rg, "cpf, @cpf, "aniversario", @aniversario)
  ]%%
  
  <script runat="server">
  Platform.Load("core", "1");
  Platform.Response.SetResponseHeader("Access-Control-Allow-Methods", "POST");
  Platform.Response.SetResponseHeader("Access-Control-Allow-Origin", "*");
  Platform.Response.SetResponseHeader("Set-Cookie", "Secure");
  Platform.Response.SetResponseHeader("Strict-Transport-Security", "max-age = 0, cache-control: private, no-cache  ");
  Platform.Response.SetResponseHeader("X-XSS-Protection", "1; mode=block");
  Platform.Response.SetResponseHeader("X-Frame-Options", "Deny");
  Platform.Response.SetResponseHeader("X-Content-Type-Options", "nosniff");
  Platform.Response.SetResponseHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  Platform.Response.SetResponseHeader("Content-Security-Policy", "default-src 'self'");
  Platform.Response.SetResponseHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  
  var email = Variable.GetValue("@email");
  
  if (isEmpty(email)){
    Write('{"message":"Não é possível inserir dados Nulos:","statusCode":500}');
  }else{
   try{
       var de = DataExtension.Init('Vtex_Newsletter_Leads');
      try{
        var results = Variable.GetValue("@results");
  
        if (isEmpty(results)){
          try{
            de.Rows.Add({
            email:email,
            SubscriberKey:"lead_" + email
           
              
          });
  
            Write('{"message":"<b>Seu e-mail foi cadastrado com sucesso.</b>","statusCode":200}');
  
            }catch(err){
             Write('{"message":"Erro ao inserir os dados, tente novamente","statusCode":500}');  
            }
           
         }else{
           Write('{"message":"O Email já foi cadastrado.","statusCode":400}');
          }
      }catch(err){
         Write('{"message":"Não foi possível consultar as informações","statusCode":500}');  
      }
   }catch(err){
     Write('{"message":"Não foi possível iniciar a DataExtension","statusCode":500}');
   }
  }
  
  
  function isEmpty(str) {
      return (!str || 0 === str.length);
  }
  
  </script>