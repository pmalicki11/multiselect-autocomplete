<html>
  <head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/ico" href="pm.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
    <link rel="stylesheet" href="./src/bootstrap.min.css">
    <link rel="stylesheet" href="./src/multiselect-autocomplete.css">
    <link rel="icon" href="../logos/pmlSimple.svg">
    <link rel="mask-icon" href="../logos/pmlSimple.svg" color="#000000">
    <link rel="apple-touch-icon" href="../logos/pmlSimple.svg">
    <title>Multiselect-autocomplete - PML Software</title>
  </head>
  <body>
    <div class="pt-5 pd-2 text-white" style="background-image: linear-gradient(0deg, rgba(26,0,177,1) 0%, rgba(19,50,56,1) 100%)">
      <div class="container">
        <h2 class="pb-3">Multiselect-Autocomplete</h2>
        <p class="lead">
          This component allows to grab multiple elements inside which gives an opportunity to submit them all together.
          It comes with the autocomplete functionality that could be bind to external API.
          It all arose as a result of the need to use such a solution on one of my webpages.
          Plus, it gave me a great opportunity to learn Vanilla JavaScript and lot of fun of course.
          Of course it may have and probably has bugs.
        </p>
        <div class="align-items-center py-4 m-1"></div>
      </div>
    </div>

    <div class="container">
      <div class="py-5">
        <h3>Example</h3>
        <p class="lead">
          This example shows Name input among some standard inputs.
        </p>
        <div class="row">
          <div class="container-fluid bg-light p-3 rounded" id="sample-form">
            <form action="#">
              <div class="form-group row align-items-center">
                <label class="control-label col-md-3 font-weight-bold" for="i1">Input 1:</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" id="i1" name="i1">
                </div>
              </div>
              <div class="form-group row align-items-center">
                <label class="control-label col-md-3 font-weight-bold" for="i2">Input 2:</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" id="i2" name="i2">
                </div>
              </div>
              <div class="form-group row align-items-center">
                <label class="control-label col-md-3 font-weight-bold" for="i3">Names:</label>
                <div class="col-md-9">
                  <div class="multiselect-autocomplete" id="i3"></div>
                </div>
              </div>
              <div class="form-group row align-items-center">
                <label class="control-label col-md-3 font-weight-bold" for="i4">Input 4:</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" id="i4" name="i4">
                </div>
              </div>
            </form>
          </div>
          <h4 class="mt-3 ml-3">Code</h4>
          <div class="container-fluid bg-light px-3 py-2 border">
            <pre><script src="./samples/insertExampleForm.js"></script></pre>
          </div>
        </div>
      </div>
      
      <div class="py-5">
        
        <h3>Installation</h3>
        <p class="lead">
          Following steps are describing what to do before use.
        </p>
        
        <div class="mb-2">
          <h5 class="mt-2 ml-3">
            1. Download following files from
            <a href="https://github.com/pmalicki11/multiselect-autocomplete/tree/master/src"><u>here</u></a>
            and paste it in your project directory.</h5>
          <div class="container-fluid bg-light p-2 mb-3 border">
            <ol class="mb-0">
              <li>multiselect-autocomplete.js</li>
              <li>multiselect-autocomplete.css</li>
              <li>bootstrap.min.css</li>
              <li>bootstrap.min.css.map</li>
            </ol>
          </div>
        </div>

        <div class="mb-2">
          <h5 class="mt-5 ml-3">2. Add references to component files in your project.</h5>
          <p class="lead ml-3">
            Insert below lines in your HTML for reference component source code and other files.
          </p>
          <div class="container-fluid bg-light p-2 border">
            <pre class="mb-0"><script src="./samples/insertReferences.js"></script></pre>
          </div>
        </div>

        <div class="mb-2">
          <h5 class="mt-5 ml-3">3. Add empty DIV element in your code and set its class to "multiselect-autocomplete".</h5>
          <p class="lead ml-3">Insert below line in your HTML in the place where you want to get component to be loaded.</p>
          <div class="container-fluid bg-light p-2 border">
            <pre class="mb-0"><script src="./samples/insertMultiselect.js"></script></pre>
          </div>
        </div>
      
      </div>
      
      <div class="py-5">
        
        <h3>Parametrization</h3>
        <p class="lead">
          There are a couple of parameters that need to be set to finally get this component working.
          Don't worry they are very simple to understand!
        </p>
      
        <div class="mb-2">
          <p class="lead ml-3">
            Everything starts to happen inside <b>multiselect-autocomplete.js</b> file in this event handler.
          </p>
          <div class="container-fluid bg-light p-2 border">
            <pre class="mb-0"><script src="./samples/insertEventHandler.js"></script></pre>
          </div>
          <p class="lead ml-3">  
            This will fire when webpage is fully loaded and inside here you need to do a simple setup.
          </p>
          <p class="lead ml-3">
            Parameters are passed as an one and only argument of a MultiselectAutocomplete class constructor which is JSON object.
          </p>
          <div class="container-fluid bg-light p-2 border">
            <pre class="mb-0"><script src="./samples/insertParameters.js"></script></pre>
          </div>
          <div class="overflow-auto mt-3">
            <table class="table table-bordered">
              <tr class="bg-light">
                <th>Parameter</th>
                <th>Required</th>
                <th>Default value</th>
                <th>Description</th>
              </tr>
              <tr>
                <td><b>element</b></td>
                <td>No</td>
                <td>DOM element with class="multiselect-autocomplete"</td>
                <td>
                  Class name of empty DIV element to which component will be loaded.
                  If multiple components are used on webpage then those classes needs to be different and each component needs to be constructed separately.</td>
              </tr>
              <tr>
                <td><b>requestURL</b></td>
                <td>Yes</td>
                <td>Do not apply</td>
                <td>URL address used for sending requests.</td>
              </tr>
              <tr>
                <td><b>inputValueAsRequestPart</b></td>
                <td>No</td>
                <td>false</td>
                <td>Determines if text you type into input is be part of request.</td>
              </tr>
              <tr>
                <td><b>filterRequestDataByInput</b></td>
                <td>No</td>
                <td>true</td>
                <td>Determines if data returned by request should be filtered to match value that has been entered in the input.</td>
              </tr>
              <tr>
                <td><b>maxDropdownItems</b></td>
                <td>No</td>
                <td>5</td>
                <td>Maximum number of items that can appear in dropdown list.</td>
              </tr>
              <tr>
                <td><b>bootstrapStyle</b></td>
                <td>No</td>
                <td>false</td>
                <td>
                  Determines if component should look like bootstrap's
                  <a href="https://getbootstrap.com/docs/4.0/components/forms/#form-controls">form-control</a> input.
                </td>
              </tr>
            </table>
          </div>
        </div>

      </div>

      <div class="py-5 text-center">
        
        <h3>Summary</h3>
        <p class="lead">
          This component is totally free. You can just take it do whatever you will desire!
          It will be great if anyone will find if useful.
        </p>
        <div class="lead">
          <b>Author: Paweł Malicki</b><br/>
          <div class="mt-2">
            <a href="https://www.linkedin.com/in/pawe%C5%82-malicki-53929b12b" class="li-ic lead col-sm-1" role="button"><i class="fab fa-lg fa-linkedin-in"></i></a>
            <a href="https://github.com/pmalicki11" class="git-ic lead text-dark col-sm-1" role="button"><i class="fab fa-lg fa-github"></i></a>
          </div>
        </div>

        <div class="lead mt-4">
          <p>I would like to thank <b>Tomasz Ziebura (B0r3d)</b> who helped me a lot with this project.
            Tomasz, if not you I would probably give up and this component would not arise.
            Thank you for your support, understanding and paitence!
          </p>
          <b>Tomasz Ziebura</b><br/>
          <div class="mt-2">
            <a href="https://www.linkedin.com/in/tomasz-ziebura-3733271a5" class="li-ic lead col-sm-1" role="button"><i class="fab fa-lg fa-linkedin-in"></i></a>
            <a href="https://github.com/B0r3d" class="git-ic lead text-dark col-sm-1" role="button"><i class="fab fa-lg fa-github"></i></a>
          </div>
        </div>

        <div class="lead mt-5">
          <p>Additional thanks to</p>
          <span>
            Paweł Maślanka<b class="text-danger"> | </b>
            Radek Wawrzyk<b class="text-danger"> | </b>
            Artur Jóźwik<b class="text-danger"> | </b>
            Staszek Gregor
          </span>
        </div>

      </div>    
    </div>
    <script src="./src/multiselect-autocomplete.js"></script>
  </body>
</html>


