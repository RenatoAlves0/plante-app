import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';

const request = "https://localhost:5001/api/planta";

void main() async {
  runApp(MaterialApp(home: Home()));
  print(getData());
}

Future<Map> getData() async {
  http.Response response = await http.get(request);
  return json.decode(response.body);
}

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<Color> _cores = [
    Colors.green,
    Color.fromARGB(255, 25, 112, 182),
    Colors.brown,
    Colors.amber
  ];
  List<String> _titulos = ["Planta", "Clima", "Solo", "Luz"];
  int _itemSelected = 0;
  void _cahngeItemSelected(int index) {
    setState(() {
      _itemSelected = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titulos[_itemSelected]),
        centerTitle: true,
        backgroundColor: _cores[_itemSelected],
      ),
      body: _itemSelected == 0 ? Plantas() : null,
      bottomNavigationBar: BottomNavigationBar(
        onTap: (index) => _cahngeItemSelected(index),
        currentIndex: _itemSelected,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.spa),
            title: Text(_titulos[0]),
            backgroundColor: _cores[0],
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.cloud_queue),
              title: Text(_titulos[1]),
              backgroundColor: _cores[1]),
          BottomNavigationBarItem(
              icon: Icon(Icons.grain),
              title: Text(_titulos[2]),
              backgroundColor: _cores[2]),
          BottomNavigationBarItem(
              icon: Icon(Icons.wb_sunny),
              title: Text(_titulos[3]),
              backgroundColor: _cores[3]),
        ],
      ),
    );
  }
}

class Plantas extends StatefulWidget {
  @override
  _PlantasState createState() => _PlantasState();
}

class _PlantasState extends State<Plantas> {
  TextEditingController especie, genero, familia = TextEditingController();
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  double _fontSize = 20, _paddingHorizontal = 30, _paddingTop = 20;
  Color _color = Colors.green;

  void _resetFields() {
    especie.text = genero.text = familia.text = "";
  }

  void _requestHTTP() async {
    http.Response response = await http.get(request);
    print(response.body);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
          padding: EdgeInsets.only(
              top: _paddingTop,
              left: _paddingHorizontal,
              right: _paddingHorizontal),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: <Widget>[
                TextFormField(
                  keyboardType: TextInputType.multiline,
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    labelText: 'Espécie',
                    labelStyle: TextStyle(color: _color, fontSize: _fontSize),
                  ),
                  controller: especie,
                  validator: (value) {
                    if (value.isEmpty) return "Informe a Espécie";
                  },
                ),
                TextFormField(
                  keyboardType: TextInputType.multiline,
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    labelText: 'Gênero',
                    labelStyle: TextStyle(color: _color, fontSize: _fontSize),
                  ),
                  controller: genero,
                  validator: (value) {
                    if (value.isEmpty) return "Informe o Gênero";
                  },
                ),
                TextFormField(
                  keyboardType: TextInputType.multiline,
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    labelText: 'Família',
                    labelStyle: TextStyle(color: _color, fontSize: _fontSize),
                  ),
                  controller: familia,
                  validator: (value) {
                    if (value.isEmpty) return "Informe a Família";
                  },
                ),
                Padding(
                  padding: EdgeInsets.only(top: _paddingTop),
                  child: Container(
                    height: 50,
                    width: 1000,
                    child: RaisedButton(
                      onPressed: () {
                        if (_formKey.currentState.validate()) {
                          //salvar();
                          _resetFields();
                          _requestHTTP();
                        }
                      },
                      color: _color,
                      child: Text(
                        "Salvar",
                        style:
                            TextStyle(color: Colors.white, fontSize: _fontSize),
                      ),
                    ),
                  ),
                )
              ],
            ),
          )),

      // floatingActionButton: FloatingActionButton(
      //   backgroundColor: Colors.blue,
      //   tooltip: 'Adicionar planta',
      //   child: Center(
      //     child: Icon(Icons.add),
      //   ),
      // ),
    );
  }
}
