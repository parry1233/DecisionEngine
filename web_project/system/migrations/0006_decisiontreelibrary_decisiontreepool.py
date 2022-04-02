# Generated by Django 3.2.9 on 2021-12-04 12:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0005_rename_collection_variablepool_datatype'),
    ]

    operations = [
        migrations.CreateModel(
            name='DecisionTreeLibrary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Enter name', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='DecisionTreePool',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rule', models.TextField(help_text='Rule', null=True)),
                ('fkey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='system.decisiontreelibrary')),
                ('prev', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='system.decisiontreepool')),
            ],
        ),
    ]
