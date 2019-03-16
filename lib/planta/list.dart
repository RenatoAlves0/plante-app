import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'form.dart';

class ListPlanta extends StatefulWidget {
  @override
  _ListPlantaState createState() => _ListPlantaState();
}

class _ListPlantaState extends State<ListPlanta> {
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

  @override
  Widget build(context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView.builder(
                itemCount: plantaList.length, itemBuilder: buildItem),
          ),
          buildButton(),
        ],
      ),
    );
  }

  Widget buildItem(context, index) {
    return Dismissible(
      key: Key(DateTime.now().millisecondsSinceEpoch.toString()),
      background: Container(
        color: Colors.red,
        child: Align(
          alignment: Alignment(-0.9, 0.0),
          child: Icon(
            Icons.delete,
            color: Colors.white,
          ),
        ),
      ),
      direction: DismissDirection.startToEnd,
      child: buildList(context, index),
      onDismissed: (direction) {
        setState(() {
          ultimoDeletado = Map.from(plantaList[index]);
          indexUltimoDeletado = index;
          plantaList.removeAt(index);
          savePlanta();
          Scaffold.of(context).showSnackBar(buildSnack());
        });
      },
    );
  }

  Widget buildList(context, index) {
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

  Widget buildSnack() {
    return SnackBar(
      content: Text("Palnta ${ultimoDeletado["nomePopular"]} removida!"),
      action: SnackBarAction(
          label: "Desfazer",
          onPressed: () {
            setState(() {
              plantaList.insert(indexUltimoDeletado, ultimoDeletado);
              savePlanta();
            });
          }),
      duration: Duration(seconds: 4),
    );
  }

  Widget buildButton() {
    return Container(
      padding: EdgeInsets.only(bottom: 15),
      alignment: Alignment(0.9, 0),
      child: FloatingActionButton(
        backgroundColor: Colors.green,
        child: Icon(Icons.add),
        onPressed: goToForm,
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

  void goToForm() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => FormPlanta()));
  }
}
