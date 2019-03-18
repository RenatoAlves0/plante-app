import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'form.dart';
import '../components/bottomBar.dart';
import '../http_provider.dart';

class ListPlanta extends StatefulWidget {
  @override
  _ListPlantaState createState() => _ListPlantaState();
}

class _ListPlantaState extends State<ListPlanta> {
  //Variáveis

  List plantaList = [];
  Map<String, dynamic> ultimoDeletado;
  int indexUltimoDeletado;

  @override
  void initState() {
    super.initState();
    getPlanta().then((data) {
      setState(() {
        plantaList = json.decode(data);
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
      bottomNavigationBar: BottomBar(propsItemSelected: 0),
    );
  }

  Widget builBackGround() {
    return Container(
        child: builList(),
        decoration: BoxDecoration(
            gradient: LinearGradient(
                colors: [Colors.green[700], Colors.green, Colors.white],
                begin: FractionalOffset(0.5, 0),
                end: FractionalOffset(0.5, 0.6),
                tileMode: TileMode.clamp)));
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
        itemCount: plantaList.length, itemBuilder: builDismissible);
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
        plantaList[index]["nomePopular"],
        style: TextStyle(fontSize: 20),
      ),
      subtitle: Text(
        plantaList[index]["familia"] +
            " " +
            plantaList[index]["genero"] +
            " " +
            plantaList[index]["especie"],
        style: TextStyle(fontSize: 15),
      ),
      onTap: goToForm,
    );
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
              plantaList.insert(indexUltimoDeletado, ultimoDeletado);
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

  void onDismissed(context, index) {
    setState(() {
      ultimoDeletado = Map.from(plantaList[index]);
      indexUltimoDeletado = index;
      plantaList.removeAt(index);
      savePlanta();
      Scaffold.of(context).showSnackBar(buildSnack());
    });
  }

  void goToForm() {
    // WebClient().get("https://10.0.2.2:5001/api/planta");
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => FormPlanta(), fullscreenDialog: true));
  }
}
