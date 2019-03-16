import 'package:flutter/material.dart';
import 'planta/list.dart';

void main() async {
  runApp(MaterialApp(home: Home()));
}

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return ListPlanta();
  }
}

// class Plantas extends StatefulWidget {
//   @override
//   _PlantasState createState() => _PlantasState();
// }

// class _PlantasState extends State<Plantas> {
//   TextEditingController especie, genero, familia = TextEditingController();
//   GlobalKey<FormState> _formKey = GlobalKey<FormState>();
//   double _fontSize = 20, _paddingHorizontal = 30, _paddingTop = 20;
//   Color _color = Colors.green;

//   void _resetFields() {
//     especie.text = genero.text = familia.text = "";
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: SingleChildScrollView(
//           padding: EdgeInsets.only(
//               top: _paddingTop,
//               left: _paddingHorizontal,
//               right: _paddingHorizontal),
//           child: Form(
//             key: _formKey,
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.end,
//               children: <Widget>[
//                 TextFormField(
//                   keyboardType: TextInputType.multiline,
//                   textAlign: TextAlign.center,
//                   decoration: InputDecoration(
//                     labelText: 'Espécie',
//                     labelStyle: TextStyle(color: _color, fontSize: _fontSize),
//                   ),
//                   controller: especie,
//                   validator: (value) {
//                     if (value.isEmpty) return "Informe a Espécie";
//                   },
//                 ),
//                 TextFormField(
//                   keyboardType: TextInputType.multiline,
//                   textAlign: TextAlign.center,
//                   decoration: InputDecoration(
//                     labelText: 'Gênero',
//                     labelStyle: TextStyle(color: _color, fontSize: _fontSize),
//                   ),
//                   controller: genero,
//                   validator: (value) {
//                     if (value.isEmpty) return "Informe o Gênero";
//                   },
//                 ),
//                 TextFormField(
//                   keyboardType: TextInputType.multiline,
//                   textAlign: TextAlign.center,
//                   decoration: InputDecoration(
//                     labelText: 'Família',
//                     labelStyle: TextStyle(color: _color, fontSize: _fontSize),
//                   ),
//                   controller: familia,
//                   validator: (value) {
//                     if (value.isEmpty) return "Informe a Família";
//                   },
//                 ),
//                 Padding(
//                   padding: EdgeInsets.only(top: _paddingTop),
//                   child: Container(
//                     height: 50,
//                     width: 1000,
//                     child: RaisedButton(
//                       onPressed: () {
//                         if (_formKey.currentState.validate()) {
//                           //salvar();
//                           _resetFields();
//                         }
//                       },
//                       color: _color,
//                       child: Text(
//                         "Salvar",
//                         style:
//                             TextStyle(color: Colors.white, fontSize: _fontSize),
//                       ),
//                     ),
//                   ),
//                 )
//               ],
//             ),
//           )),
//     );
//   }
// }
