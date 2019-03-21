import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'list.dart';

class FormPlanta extends StatefulWidget {
  final Map<String, dynamic> planta;
  const FormPlanta({Key key, this.planta}) : super(key: key);
  @override
  _FormPlantaState createState() => _FormPlantaState();
}

class _FormPlantaState extends State<FormPlanta> {
  final color = Colors.green[700];
  final especie = TextEditingController();
  final genero = TextEditingController();
  final familia = TextEditingController();
  final apelido = TextEditingController();
  List plantas = [];

  Map<String, dynamic> planta = {};

  @override
  void initState() {
    super.initState();
    getPlantas().then((data) {
      setState(() {
        plantas = json.decode(data);
      });
    });
    getPlanta();
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
      buildTextField("Família", familia),
      Divider(
        color: Colors.transparent,
      ),
      buildTextField("Gênero", genero),
      Divider(
        color: Colors.transparent,
      ),
      buildTextField("Espécie", especie),
      Divider(
        color: Colors.transparent,
      ),
      buildTextField("Apelido", apelido),
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
    String data = json.encode(plantas);
    final file = await getFile();
    return file.writeAsString(data);
  }

  void getPlanta() {
    if (widget.planta != null) {
      setState(() {
        familia.text = widget.planta["familia"];
        genero.text = widget.planta["genero"];
        especie.text = widget.planta["especie"];
        apelido.text = widget.planta["nomePopular"];
      });
    }
  }

  Future<String> getPlantas() async {
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
      planta["especie"] = especie.text;
      planta["genero"] = genero.text;
      planta["familia"] = familia.text;
      planta["nomePopular"] = apelido.text;
      especie.text = "";
      genero.text = "";
      familia.text = "";
      apelido.text = "";
      plantas.add(planta);
      savePlanta();
    });
    goToList();
  }
}
