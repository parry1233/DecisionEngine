# Generated by Django 3.2.9 on 2022-03-30 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0014_auto_20220131_1455'),
    ]

    operations = [
        migrations.AlterField(
            model_name='decisiontreelibrary',
            name='name',
            field=models.CharField(help_text='Enter name', max_length=50),
        ),
        migrations.AlterField(
            model_name='scorecardlibrary',
            name='name',
            field=models.CharField(help_text='Enter name', max_length=50),
        ),
        migrations.AlterField(
            model_name='variablelibrary',
            name='name',
            field=models.CharField(help_text='Enter name', max_length=50),
        ),
    ]