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
  final color = Colors.green[700];

  final especieController = TextEditingController();
  final generoController = TextEditingController();
  final familiaController = TextEditingController();
  final apelidoController = TextEditingController();

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: buildAppBar(),
      body: buildBodyBox(),
    );
  }

  Widget buildAppBar() {
    return AppBar(
      title: Text("Planta"),
      backgroundColor: Colors.green[700],
      centerTitle: true,
      actions: <Widget>[buildButton()],
    );
  }

  Widget buildButton() {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 15, vertical: 10),
        child: RaisedButton(
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Text("Salvar", style: TextStyle(color: Colors.green[700])),
            color: Colors.white,
            onPressed: addPlanta));
  }

  Widget buildBodyBox() {
    return SingleChildScrollView(
        child: Column(children: <Widget>[
      Divider(
        color: Colors.transparent,
      ),
      buildTextField("Família", familiaController),
      Divider(
        color: Colors.transparent,
      ),
      buildTextField("Gênero", generoController),
      Divider(
        color: Colors.transparent,
      ),
      buildTextField("Espécie", especieController),
      Divider(
        color: Colors.transparent,
      ),
      buildTextField("Apelido", apelidoController),
      Divider(
        color: Colors.transparent,
      ),
    ]));
  }

  Widget buildTextField(String label, TextEditingController controller) {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 17),
        child: TextField(
          controller: controller,
          decoration: InputDecoration(
              labelText: label,
              focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.grey[800])),
              enabledBorder: const OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.transparent),
              ),
              border: const OutlineInputBorder(),
              labelStyle: TextStyle(color: Colors.grey[800], fontSize: 20)),
        ));
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

  void addPlanta() {
    setState(() {
      Map<String, dynamic> newPlanta = Map();
      newPlanta["especie"] = especieController.text;
      newPlanta["genero"] = generoController.text;
      newPlanta["familia"] = familiaController.text;
      newPlanta["nomePopular"] = apelidoController.text;
      especieController.text = "";
      generoController.text = "";
      familiaController.text = "";
      apelidoController.text = "";
      plantaList.add(newPlanta);
      savePlanta();
    });
    goToList();
  }
}
