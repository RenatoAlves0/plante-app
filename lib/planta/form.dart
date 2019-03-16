import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'list.dart';

class FormPlanta extends StatefulWidget {
  @override
  _FormPlantaState createState() => _FormPlantaState();
}

class _FormPlantaState extends State<FormPlanta> {
  final _color = Colors.green;

  final _especieController = TextEditingController();
  final _generoController = TextEditingController();
  final _familiaController = TextEditingController();
  final _apelidoController = TextEditingController();

  List plantaList = [];

  @override
  void initState() {
    super.initState();
    getPlanta().then((data) {
      setState(() {
        plantaList = json.decode(data);
      });
    });
  }

  void addPlanta() {
    setState(() {
      Map<String, dynamic> newPlanta = Map();
      newPlanta["especie"] = _especieController.text;
      newPlanta["genero"] = _generoController.text;
      newPlanta["familia"] = _familiaController.text;
      newPlanta["nomePopular"] = _apelidoController.text;
      _especieController.text = "";
      _generoController.text = "";
      _familiaController.text = "";
      _apelidoController.text = "";
      plantaList.add(newPlanta);
      savePlanta();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: <Widget>[
                  Divider(
                    color: Colors.transparent,
                  ),
                  buildTextField("Família", _familiaController),
                  Divider(
                    color: Colors.transparent,
                  ),
                  buildTextField("Gênero", _generoController),
                  Divider(
                    color: Colors.transparent,
                  ),
                  buildTextField("Espécie", _especieController),
                  Divider(
                    color: Colors.transparent,
                  ),
                  buildTextField("Apelido", _apelidoController),
                ],
              ),
            ),
          ),
          buildButton(),
        ],
      ),
    );
  }

  Widget buildTextField(String label, TextEditingController c) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 17),
      child: TextField(
        controller: c,
        decoration: InputDecoration(
            labelText: label,
            focusedBorder:
                OutlineInputBorder(borderSide: BorderSide(color: _color)),
            enabledBorder: const OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
            ),
            border: const OutlineInputBorder(),
            labelStyle: TextStyle(color: _color, fontSize: 20)),
      ),
    );
  }

  Widget buildButton() {
    return Container(
      padding: EdgeInsets.only(bottom: 15),
      alignment: Alignment(0.9, 0),
      child: FloatingActionButton(
        backgroundColor: Colors.green,
        child: Icon(Icons.save),
        onPressed: () {
          addPlanta();
          goToList();
        },
      ),
    );
  }

  Future<File> getFile() async {
    final directory = await getApplicationDocumentsDirectory();
    return File("${directory.path}/planta.json");
  }

  Future<File> savePlanta() async {
    String data = json.encode(plantaList);
    final file = await getFile();
    return file.writeAsString(data);
  }

  Future<String> getPlanta() async {
    try {
      final file = await getFile();
      return file.readAsString();
    } catch (e) {
      return null;
    }
  }

  void goToList() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => ListPlanta()));
  }
}
