import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'form.dart';
import '../components/bottomBar.dart';

class ListPlanta extends StatefulWidget {
  @override
  _ListPlantaState createState() => _ListPlantaState();
}

class _ListPlantaState extends State<ListPlanta> {
  //Variáveis

  List plantas = [];
  Map<String, dynamic> ultimoDeletado;
  int indexUltimoDeletado;

  @override
  void initState() {
    super.initState();
    getPlantas().then((data) {
      setState(() {
        plantas = json.decode(data);
      });
    });
  }

  //Widgets

  @override
  Widget build(context) {
    return Scaffold(
      appBar: buildAppBar(),
      body: builList(),
      floatingActionButton: buildButton(),
      bottomNavigationBar: BottomBar(itemSelected: 0),
    );
  }

  Widget buildAppBar() {
    return AppBar(
      title: Text("Plantas"),
      backgroundColor: Colors.green[700],
      elevation: 0,
      centerTitle: true,
    );
  }

  Widget builList() {
    return ListView.builder(
        itemCount: plantas.length, itemBuilder: builDismissible);
  }

  Widget builDismissible(context, index) {
    return Dismissible(
        key: Key(DateTime.now().millisecondsSinceEpoch.toString()),
        background: backgroudDismissible(),
        direction: DismissDirection.startToEnd,
        child: buildListItem(context, index),
        onDismissed: (direction) => onDismissed(context, index));
  }

  Widget backgroudDismissible() {
    return Container(
        color: Colors.red,
        child: Align(
            alignment: Alignment(-0.9, 0.0),
            child: Icon(
              Icons.delete,
              color: Colors.white,
            )));
  }

  Widget buildListItem(context, index) {
    return ListTile(
        contentPadding: EdgeInsets.symmetric(horizontal: 30),
        title: Text(
          plantas[index]["nomePopular"],
          style: TextStyle(fontSize: 20),
        ),
        subtitle: Text(
          plantas[index]["familia"] +
              " " +
              plantas[index]["genero"] +
              " " +
              plantas[index]["especie"],
          style: TextStyle(fontSize: 15),
        ),
        onTap: () {
          editPlanta(index);
        });
  }

  Widget buildButton() {
    return FloatingActionButton(
      backgroundColor: Colors.green[700],
      child: Icon(Icons.add),
      onPressed: goToForm,
    );
  }

  Widget buildSnack() {
    return SnackBar(
      content: Text("Restaurar ${ultimoDeletado["nomePopular"]}?"),
      backgroundColor: Colors.red,
      action: SnackBarAction(
          label: "Sim",
          textColor: Colors.white,
          onPressed: () {
            setState(() {
              plantas.insert(indexUltimoDeletado, ultimoDeletado);
              savePlanta();
            });
          }),
      duration: Duration(seconds: 4),
    );
  }

  //Métodos

  Future<File> getFile() async {
    final directory = await getApplicationDocumentsDirectory();
    return File("${directory.path}/planta.json");
  }

  Future<File> savePlanta() async {
    String data = json.encode(plantas);
    final file = await getFile();
    return file.writeAsString(data);
  }

  Future<String> getPlantas() async {
    try {
      final file = await getFile();
      return file.readAsString();
    } catch (e) {
      return null;
    }
  }

  void onDismissed(context, index) {
    setState(() {
      ultimoDeletado = Map.from(plantas[index]);
      indexUltimoDeletado = index;
      plantas.removeAt(index);
      savePlanta();
      Scaffold.of(context).showSnackBar(buildSnack());
    });
  }

  void editPlanta(index) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => FormPlanta(planta: plantas[index]), fullscreenDialog: true));
  }

  void goToForm() {
    // WebClient().get("https://10.0.2.2:5001/api/planta");
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => FormPlanta(), fullscreenDialog: true));
  }
}