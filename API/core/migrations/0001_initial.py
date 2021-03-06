# Generated by Django 3.0 on 2021-12-17 07:03

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('user_type', models.IntegerField(choices=[(1, 'Admin'), (2, 'Funds Manager'), (3, 'Supervisor'), (4, 'None')], default=4, help_text='This field determines the designation of the user', verbose_name='User Designation')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Bank',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Bank_name', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Director',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('director_name', models.CharField(max_length=256)),
                ('director_signature', models.FileField(blank=True, null=True, upload_to='DirectorSignature/')),
            ],
        ),
        migrations.CreateModel(
            name='Fund',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fund_name', models.CharField(max_length=256)),
                ('registration_no', models.CharField(max_length=50)),
                ('fund_description', models.TextField()),
                ('supervisor_approval', models.IntegerField(choices=[(1, 'Pending'), (2, 'Approved'), (3, 'Rejected')], default=1)),
                ('supervisor_reason', models.TextField(blank=True)),
                ('manager_approval', models.IntegerField(choices=[(1, 'Pending'), (2, 'Approved'), (3, 'Rejected')], default=1)),
                ('manager_reason', models.TextField(blank=True)),
                ('fund_type', models.IntegerField(choices=[(0, 'regulated'), (1, 'unregulated')], default=0)),
                ('fund_manager_entity', models.CharField(blank=True, max_length=256)),
                ('fund_structure', models.IntegerField(choices=[(0, 'open-ended'), (1, 'close-ended')], default=0)),
                ('offer_price', models.DecimalField(decimal_places=2, default=1.0, max_digits=6)),
                ('issued_shares', models.IntegerField(default=1)),
                ('ordinary_shares', models.IntegerField(default=1)),
                ('fund_status', models.IntegerField(choices=[(0, 'onboarding'), (1, 'open'), (2, 'funded'), (3, 'refund'), (4, 'frozen'), (5, 'unfrozen'), (6, 'close'), (7, 'extendterm')], default=0)),
                ('reason_to_change', models.TextField(blank=True)),
                ('fund_size', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('lock_up_period', models.IntegerField(default=0, help_text='Time in years')),
                ('fund_year_end', models.IntegerField(choices=[(0, 'Jan'), (1, 'Feb'), (2, 'Mar'), (3, 'Apr'), (4, 'May'), (5, 'Jun'), (6, 'Jul'), (7, 'Aug'), (8, 'Sep'), (9, 'Oct'), (10, 'Nov'), (11, 'Dec')], default=11)),
                ('fund_end_date', models.DateField()),
                ('catch_up', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('legal_counsel', models.CharField(blank=True, max_length=256)),
                ('legal_counsel_rep', models.CharField(blank=True, max_length=256)),
                ('Auditor', models.CharField(blank=True, max_length=256)),
                ('Auditor_rep', models.CharField(blank=True, max_length=256)),
                ('Custodian', models.CharField(blank=True, max_length=256)),
                ('Custodian_rep', models.CharField(blank=True, max_length=256)),
                ('asset_under_management', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('FundAdministrator', models.CharField(max_length=256)),
                ('GIIN', models.CharField(max_length=50)),
                ('Preparer', models.CharField(blank=True, max_length=256, null=True)),
                ('Subscription_Agreement', models.FileField(upload_to='subscription_agreement/')),
                ('Investment_Agreement', models.FileField(upload_to='investment_agreement/')),
                ('PPM', models.FileField(upload_to='ppm/')),
                ('Director_Fees', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('Management_Fee', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('Hurdle_Rate', models.DecimalField(decimal_places=4, default=0.0, max_digits=6)),
                ('CTC', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('BankAccount', models.PositiveIntegerField()),
                ('BankAccessID', models.CharField(max_length=50)),
                ('BankAccessPassword', models.CharField(max_length=50)),
                ('redeem', models.CharField(blank=True, max_length=256)),
                ('redeemReason', models.TextField(blank=True)),
                ('liquidate', models.CharField(blank=True, max_length=256)),
                ('liquidateReason', models.TextField(blank=True)),
                ('Approver', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='approve', to='core.Director')),
                ('AuthorizedSignatory', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='authorized_sign', to='core.Director')),
                ('Bank', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.Bank')),
            ],
        ),
        migrations.CreateModel(
            name='FundCountry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country_name', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='ProductType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_type_name', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='ReclassificationFrequency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reclassification_frequency_name', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='ReportingCurrency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('currency', models.CharField(max_length=256, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='ReportingFrequency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reporting_frequency_name', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Subscriber',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subscriber_name', models.CharField(max_length=256)),
                ('subscriber_commitment', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Fund')),
            ],
        ),
        migrations.CreateModel(
            name='FundLifeOpen',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fundlife', models.PositiveIntegerField()),
                ('Board_Extension', models.PositiveIntegerField()),
                ('Investor_Extension', models.PositiveIntegerField()),
                ('fund', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.Fund')),
            ],
        ),
        migrations.CreateModel(
            name='FundLifeClose',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fundlife', models.PositiveIntegerField()),
                ('fund', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.Fund')),
            ],
        ),
        migrations.AddField(
            model_name='fund',
            name='ReclassificationFrequency',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.ReclassificationFrequency'),
        ),
        migrations.AddField(
            model_name='fund',
            name='directors',
            field=models.ManyToManyField(related_name='directors_all', to='core.Director'),
        ),
        migrations.AddField(
            model_name='fund',
            name='domicile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.FundCountry'),
        ),
        migrations.AddField(
            model_name='fund',
            name='fund_manager_rep',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='fund_manager_representator', to='core.Director'),
        ),
        migrations.AddField(
            model_name='fund',
            name='investment_committee',
            field=models.ManyToManyField(related_name='investment_committ', to='core.Director'),
        ),
        migrations.AddField(
            model_name='fund',
            name='product_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.ProductType'),
        ),
        migrations.AddField(
            model_name='fund',
            name='report_currency',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.ReportingCurrency'),
        ),
        migrations.AddField(
            model_name='fund',
            name='reporting_frequency',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.ReportingFrequency'),
        ),
        migrations.AddField(
            model_name='fund',
            name='sub_fund',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subfund', to='core.Fund'),
        ),
        migrations.AddField(
            model_name='fund',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='closingperiod',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('closing_Date', models.DateField()),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Fund')),
            ],
        ),
        migrations.CreateModel(
            name='BoardResolution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('board_resolution', models.FileField(blank=True, null=True, upload_to='board_resolution/')),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Fund')),
            ],
        ),
    ]
